"use client"

import type React from "react"
import { useRef, useState, useEffect, useCallback } from "react"
import { Slider } from "@/components/ui/slider"
import {
  Pencil,
  Type,
  Eraser,
  Move,
  Undo,
  Redo,
  Download,
  Upload,
  Trash2,
  Save,
  Square,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  MousePointer,
} from "lucide-react"
import styles from "./sheet-music-editor.module.css"

interface Point {
  x: number
  y: number
}

interface DrawingPath {
  id: string
  points: Point[]
  color: string
  size: number
  tool: string
}

interface TextBox {
  id: string
  x: number
  y: number
  width: number
  height: number
  text: string
  color: string
  fontSize: number
  fontFamily: string
  fontWeight: string
  fontStyle: string
  textAlign: "left" | "center" | "right" | "justify"
}

interface SheetMusicEditorProps {
  onSave?: (imageData: string) => void
  initialImage?: string
  width?: number
  height?: number
}

export function SheetMusicEditor({ onSave, initialImage, width = 800, height = 600 }: SheetMusicEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textBoxRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Estado da ferramenta atual
  const [tool, setTool] = useState<"draw" | "text" | "textbox" | "erase" | "move" | "select">("draw")

  // Estados de estilo
  const [color, setColor] = useState("#000000")
  const [textColor, setTextColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState([3])
  const [fontSize, setFontSize] = useState([16])
  const [fontFamily, setFontFamily] = useState("Arial")
  const [fontWeight, setFontWeight] = useState("normal")
  const [fontStyle, setFontStyle] = useState("normal")
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right" | "justify">("left")

  // Estados de desenho
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState<Point[]>([])
  const [paths, setPaths] = useState<DrawingPath[]>([])

  // Estados de caixa de texto
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([])
  const [isCreatingTextBox, setIsCreatingTextBox] = useState(false)
  const [startPoint, setStartPoint] = useState<Point | null>(null)
  const [currentTextBox, setCurrentTextBox] = useState<TextBox | null>(null)
  const [editingTextBox, setEditingTextBox] = useState<string | null>(null)

  // Estados de seleção e redimensionamento
  const [selectedElement, setSelectedElement] = useState<{ type: "path" | "textbox"; id: string } | null>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string | null>(null)
  const [resizeStartPoint, setResizeStartPoint] = useState<Point | null>(null)

  // Estados de histórico
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Estado da imagem de fundo
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null)

  // Responsividade do canvas
  const [canvasSize, setCanvasSize] = useState({ width, height })

  // Atualizar tamanho do canvas com base no container
  useEffect(() => {
    const updateCanvasSize = () => {
      const container = canvasRef.current?.parentElement
      if (container) {
        const containerWidth = container.clientWidth - 32 // padding
        const aspectRatio = height / width
        const newWidth = Math.min(containerWidth, width)
        const newHeight = newWidth * aspectRatio

        setCanvasSize({ width: newWidth, height: newHeight })
      }
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)
    return () => window.removeEventListener("resize", updateCanvasSize)
  }, [width, height])

  // Salvar estado atual no histórico
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const imageData = canvas.toDataURL()
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(imageData)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  // Gerar ID único
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  // Função para quebrar texto em palavras e linhas
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    const words = text.split(/\s+/)
    const lines: string[] = []
    let currentLine = ""

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const metrics = ctx.measureText(testLine)

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }

    if (currentLine) {
      lines.push(currentLine)
    }

    return lines
  }

  // Função para justificar uma linha de texto
  const drawJustifiedLine = (
    ctx: CanvasRenderingContext2D,
    line: string,
    x: number,
    y: number,
    maxWidth: number,
    isLastLine = false,
  ) => {
    if (isLastLine) {
      // Última linha não é justificada
      ctx.fillText(line, x, y)
      return
    }

    const words = line.split(/\s+/)
    if (words.length <= 1) {
      ctx.fillText(line, x, y)
      return
    }

    // Calcular largura total das palavras
    const totalWordsWidth = words.reduce((sum, word) => {
      return sum + ctx.measureText(word).width
    }, 0)

    // Calcular espaço disponível para distribuir
    const totalSpaceWidth = maxWidth - totalWordsWidth
    const spaceWidth = totalSpaceWidth / (words.length - 1)

    // Desenhar palavras com espaçamento justificado
    let currentX = x
    for (let i = 0; i < words.length; i++) {
      ctx.fillText(words[i], currentX, y)
      currentX += ctx.measureText(words[i]).width
      if (i < words.length - 1) {
        currentX += spaceWidth
      }
    }
  }

  // Função principal para desenhar texto responsivo
  const drawResponsiveText = (ctx: CanvasRenderingContext2D, box: TextBox) => {
    const padding = 8
    const maxWidth = box.width - padding * 2
    const lineHeight = box.fontSize * 1.3 // Espaçamento entre linhas mais generoso

    // Configurar fonte
    ctx.fillStyle = box.color
    ctx.font = `${box.fontStyle} ${box.fontWeight} ${box.fontSize}px ${box.fontFamily}`

    // Quebrar texto em linhas
    const lines = wrapText(ctx, box.text, maxWidth)

    // Calcular posição Y inicial
    let startY = box.y + padding + box.fontSize

    // Ajustar posição Y se o texto for maior que a caixa
    const totalTextHeight = lines.length * lineHeight
    if (totalTextHeight > box.height - padding * 2) {
      // Se o texto não cabe, começar do topo
      startY = box.y + padding + box.fontSize
    } else {
      // Centralizar verticalmente se houver espaço
      const availableHeight = box.height - padding * 2
      const verticalOffset = (availableHeight - totalTextHeight) / 2
      startY = box.y + padding + box.fontSize + Math.max(0, verticalOffset)
    }

    // Desenhar cada linha
    lines.forEach((line, index) => {
      const y = startY + index * lineHeight

      // Verificar se a linha ainda está dentro da caixa
      if (y > box.y + box.height - padding) {
        return // Parar se sair da caixa
      }

      const isLastLine = index === lines.length - 1

      switch (box.textAlign) {
        case "left":
          ctx.textAlign = "left"
          ctx.fillText(line, box.x + padding, y)
          break

        case "center":
          ctx.textAlign = "center"
          ctx.fillText(line, box.x + box.width / 2, y)
          break

        case "right":
          ctx.textAlign = "right"
          ctx.fillText(line, box.x + box.width - padding, y)
          break

        case "justify":
          ctx.textAlign = "left"
          drawJustifiedLine(ctx, line, box.x + padding, y, maxWidth, isLastLine)
          break
      }
    })
  }

  // Redesenhar o canvas com todos os elementos
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Desenhar imagem de fundo se existir
    if (backgroundImage) {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
    }

    // Desenhar todos os caminhos
    paths.forEach((path) => {
      if (path.points.length < 2) return

      ctx.strokeStyle = path.color
      ctx.lineWidth = path.size
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.beginPath()
      ctx.moveTo(path.points[0].x, path.points[0].y)

      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y)
      }

      ctx.stroke()
    })

    // Desenhar todas as caixas de texto
    textBoxes.forEach((box) => {
      // Desenhar texto responsivo
      drawResponsiveText(ctx, box)

      // Desenhar borda se estiver selecionado
      if (selectedElement && selectedElement.type === "textbox" && selectedElement.id === box.id) {
        ctx.strokeStyle = "rgba(217, 168, 50, 0.8)"
        ctx.lineWidth = 2
        ctx.setLineDash([5, 3])
        ctx.strokeRect(box.x, box.y, box.width, box.height)
        ctx.setLineDash([])
      }
    })
  }, [paths, textBoxes, backgroundImage, selectedElement])

  // Efeito para redesenhar o canvas quando os elementos mudam
  useEffect(() => {
    redrawCanvas()
  }, [redrawCanvas])

  // Carregar imagem inicial se fornecida
  useEffect(() => {
    if (initialImage) {
      const img = new Image()
      img.onload = () => {
        setBackgroundImage(img)
      }
      img.src = initialImage
    }
  }, [initialImage])

  // Converter coordenadas do cliente para coordenadas do canvas
  const getCanvasPoint = (clientX: number, clientY: number): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }

  // Encontrar elemento sob o cursor
  const findElementAtPoint = (point: Point) => {
    // Primeiro verificar caixas de texto (elas estão na camada superior)
    for (let i = textBoxes.length - 1; i >= 0; i--) {
      const box = textBoxes[i]
      if (point.x >= box.x && point.x <= box.x + box.width && point.y >= box.y && point.y <= box.y + box.height) {
        return { type: "textbox" as const, id: box.id, index: i }
      }
    }

    // Depois verificar caminhos de desenho (mais difícil de selecionar com precisão)
    for (let i = paths.length - 1; i >= 0; i--) {
      const path = paths[i]
      for (const pt of path.points) {
        const distance = Math.sqrt(Math.pow(pt.x - point.x, 2) + Math.pow(pt.y - point.y, 2))
        if (distance <= path.size + 5) {
          return { type: "path" as const, id: path.id, index: i }
        }
      }
    }

    return null
  }

  // Verificar se o ponto está em uma alça de redimensionamento
  const getResizeHandleAtPoint = (point: Point, box: TextBox) => {
    const handles = [
      { name: "nw", x: box.x, y: box.y },
      { name: "n", x: box.x + box.width / 2, y: box.y },
      { name: "ne", x: box.x + box.width, y: box.y },
      { name: "e", x: box.x + box.width, y: box.y + box.height / 2 },
      { name: "se", x: box.x + box.width, y: box.y + box.height },
      { name: "s", x: box.x + box.width / 2, y: box.y + box.height },
      { name: "sw", x: box.x, y: box.y + box.height },
      { name: "w", x: box.x, y: box.y + box.height / 2 },
    ]

    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const tolerance = 10 * Math.max(scaleX, scaleY)

    for (const handle of handles) {
      const distance = Math.sqrt(Math.pow(handle.x - point.x, 2) + Math.pow(handle.y - point.y, 2))
      if (distance <= tolerance) {
        return handle.name
      }
    }

    return null
  }

  // Manipuladores de eventos do mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    const point = getCanvasPoint(e.clientX, e.clientY)

    // Se estiver editando uma caixa de texto, finalizar a edição
    if (editingTextBox !== null) {
      finishTextBoxEditing()
      return
    }

    // Verificar se clicou em uma alça de redimensionamento
    if (selectedElement && selectedElement.type === "textbox") {
      const box = textBoxes.find((b) => b.id === selectedElement.id)
      if (box) {
        const handle = getResizeHandleAtPoint(point, box)
        if (handle) {
          setIsResizing(true)
          setResizeDirection(handle)
          setResizeStartPoint(point)
          return
        }
      }
    }

    // Ferramenta de seleção
    if (tool === "select") {
      const element = findElementAtPoint(point)
      setSelectedElement(element ? { type: element.type, id: element.id } : null)

      // Se selecionou uma caixa de texto, permitir edição com duplo clique
      if (element && element.type === "textbox") {
        const box = textBoxes[element.index]
        setCurrentTextBox(box)
      }

      return
    }

    // Ferramenta de movimento
    if (tool === "move" && selectedElement) {
      return
    }

    // Ferramenta de caixa de texto
    if (tool === "textbox") {
      setIsCreatingTextBox(true)
      setStartPoint(point)
      setCurrentTextBox({
        id: generateId(),
        x: point.x,
        y: point.y,
        width: 0,
        height: 0,
        text: "",
        color: textColor,
        fontSize: fontSize[0],
        fontFamily,
        fontWeight,
        fontStyle,
        textAlign,
      })
      return
    }

    // Ferramenta de texto (clique único)
    if (tool === "text") {
      const newTextBox: TextBox = {
        id: generateId(),
        x: point.x,
        y: point.y,
        width: 200,
        height: 100,
        text: "",
        color: textColor,
        fontSize: fontSize[0],
        fontFamily,
        fontWeight,
        fontStyle,
        textAlign,
      }

      setTextBoxes([...textBoxes, newTextBox])
      setEditingTextBox(newTextBox.id)
      setCurrentTextBox(newTextBox)

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
        }
      }, 10)

      return
    }

    // Ferramenta de desenho ou borracha
    if (tool === "draw" || tool === "erase") {
      setIsDrawing(true)
      setCurrentPath([point])

      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!canvas || !ctx) return

      if (tool === "erase") {
        ctx.globalCompositeOperation = "destination-out"
        ctx.strokeStyle = "rgba(0,0,0,1)"
      } else {
        ctx.globalCompositeOperation = "source-over"
        ctx.strokeStyle = color
      }

      ctx.lineWidth = brushSize[0]
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.beginPath()
      ctx.arc(point.x, point.y, brushSize[0] / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const point = getCanvasPoint(e.clientX, e.clientY)

    // Redimensionamento de caixa de texto
    if (isResizing && resizeDirection && resizeStartPoint && selectedElement?.type === "textbox") {
      const boxIndex = textBoxes.findIndex((b) => b.id === selectedElement.id)
      if (boxIndex >= 0) {
        const box = { ...textBoxes[boxIndex] }
        const deltaX = point.x - resizeStartPoint.x
        const deltaY = point.y - resizeStartPoint.y

        // Atualizar dimensões com base na direção
        if (resizeDirection.includes("n")) {
          box.y += deltaY
          box.height -= deltaY
        }
        if (resizeDirection.includes("s")) {
          box.height += deltaY
        }
        if (resizeDirection.includes("w")) {
          box.x += deltaX
          box.width -= deltaX
        }
        if (resizeDirection.includes("e")) {
          box.width += deltaX
        }

        // Garantir dimensões mínimas
        if (box.width < 50) box.width = 50
        if (box.height < 30) box.height = 30

        // Atualizar a caixa
        const updatedBoxes = [...textBoxes]
        updatedBoxes[boxIndex] = box
        setTextBoxes(updatedBoxes)
        setCurrentTextBox(box)
        setResizeStartPoint(point)

        // Redesenhar
        redrawCanvas()
      }
      return
    }

    // Criação de caixa de texto
    if (isCreatingTextBox && startPoint && currentTextBox) {
      const width = Math.abs(point.x - startPoint.x)
      const height = Math.abs(point.y - startPoint.y)
      const x = Math.min(point.x, startPoint.x)
      const y = Math.min(point.y, startPoint.y)

      setCurrentTextBox({
        ...currentTextBox,
        x,
        y,
        width,
        height,
      })

      redrawCanvas()

      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (canvas && ctx) {
        ctx.strokeStyle = "rgba(217, 168, 50, 0.8)"
        ctx.lineWidth = 1
        ctx.setLineDash([5, 3])
        ctx.strokeRect(x, y, width, height)
        ctx.setLineDash([])
      }

      return
    }

    // Desenho ou borracha
    if (isDrawing && (tool === "draw" || tool === "erase")) {
      setCurrentPath((prev) => [...prev, point])

      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!canvas || !ctx) return

      if (tool === "erase") {
        ctx.globalCompositeOperation = "destination-out"
        ctx.strokeStyle = "rgba(0,0,0,1)"
      } else {
        ctx.globalCompositeOperation = "source-over"
        ctx.strokeStyle = color
      }

      ctx.lineWidth = brushSize[0]
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      if (currentPath.length > 0) {
        const prevPoint = currentPath[currentPath.length - 1]
        ctx.beginPath()
        ctx.moveTo(prevPoint.x, prevPoint.y)
        ctx.lineTo(point.x, point.y)
        ctx.stroke()
      }
    }
  }

  const handleMouseUp = () => {
    // Finalizar redimensionamento
    if (isResizing) {
      setIsResizing(false)
      setResizeDirection(null)
      setResizeStartPoint(null)
      saveToHistory()
      return
    }

    // Finalizar criação de caixa de texto
    if (isCreatingTextBox && currentTextBox && currentTextBox.width > 20 && currentTextBox.height > 20) {
      setTextBoxes([...textBoxes, currentTextBox])
      setEditingTextBox(currentTextBox.id)

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
        }
      }, 10)
    }

    setIsCreatingTextBox(false)
    setStartPoint(null)

    // Finalizar desenho
    if (isDrawing && currentPath.length > 1) {
      const newPath: DrawingPath = {
        id: generateId(),
        points: [...currentPath],
        color: tool === "erase" ? "transparent" : color,
        size: brushSize[0],
        tool,
      }

      setPaths([...paths, newPath])
      saveToHistory()
    }

    setIsDrawing(false)
    setCurrentPath([])
  }

  // Finalizar edição de caixa de texto
  const finishTextBoxEditing = () => {
    if (editingTextBox && textareaRef.current) {
      const text = textareaRef.current.value

      setTextBoxes((boxes) => boxes.map((box) => (box.id === editingTextBox ? { ...box, text } : box)))

      setEditingTextBox(null)
      saveToHistory()
    }
  }

  // Manipuladores de eventos de toque
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY } as React.MouseEvent)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY } as React.MouseEvent)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    handleMouseUp()
  }

  // Desfazer e refazer
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!canvas || !ctx) return

      const img = new Image()
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
      }
      img.src = history[historyIndex - 1]
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!canvas || !ctx) return

      const img = new Image()
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
      }
      img.src = history[historyIndex + 1]
    }
  }

  // Limpar canvas
  const clearCanvas = () => {
    setPaths([])
    setTextBoxes([])
    setBackgroundImage(null)
    setSelectedElement(null)
    setEditingTextBox(null)
    saveToHistory()
  }

  // Upload de imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        setBackgroundImage(img)
        saveToHistory()
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  // Download da imagem
  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "partitura.png"
    link.href = canvas.toDataURL()
    link.click()
  }

  // Salvar imagem
  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const imageData = canvas.toDataURL()
    onSave?.(imageData)
  }

  // Classe CSS para o cursor do canvas
  const getCanvasClass = () => {
    const baseClass = styles.canvas
    switch (tool) {
      case "draw":
        return `${baseClass} ${styles.canvasDraw}`
      case "text":
        return `${baseClass} ${styles.canvasText}`
      case "textbox":
        return `${baseClass} ${styles.canvasTextBox}`
      case "erase":
        return `${baseClass} ${styles.canvasErase}`
      case "move":
        return `${baseClass} ${styles.canvasMove}`
      case "select":
        return `${baseClass} ${styles.canvasSelect}`
      default:
        return baseClass
    }
  }

  // Renderizar alças de redimensionamento para a caixa de texto selecionada
  const renderResizeHandles = () => {
    if (!selectedElement || selectedElement.type !== "textbox") return null

    const box = textBoxes.find((b) => b.id === selectedElement.id)
    if (!box) return null

    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const scaleX = rect.width / canvas.width
    const scaleY = rect.height / canvas.height

    const x = box.x * scaleX
    const y = box.y * scaleY
    const width = box.width * scaleX
    const height = box.height * scaleY

    return (
      <>
        <div className={`${styles.resizeHandle} ${styles.resizeHandleNW}`} style={{ left: x, top: y }} />
        <div className={`${styles.resizeHandle} ${styles.resizeHandleNE}`} style={{ left: x + width, top: y }} />
        <div className={`${styles.resizeHandle} ${styles.resizeHandleSW}`} style={{ left: x, top: y + height }} />
        <div
          className={`${styles.resizeHandle} ${styles.resizeHandleSE}`}
          style={{ left: x + width, top: y + height }}
        />
        <div className={`${styles.resizeHandle} ${styles.resizeHandleN}`} style={{ top: y }} />
        <div className={`${styles.resizeHandle} ${styles.resizeHandleS}`} style={{ top: y + height }} />
        <div className={`${styles.resizeHandle} ${styles.resizeHandleW}`} style={{ left: x }} />
        <div className={`${styles.resizeHandle} ${styles.resizeHandleE}`} style={{ left: x + width }} />
      </>
    )
  }

  // Renderizar editor de texto
  const renderTextBoxEditor = () => {
    if (!editingTextBox) return null

    const box = textBoxes.find((b) => b.id === editingTextBox)
    if (!box) return null

    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const scaleX = rect.width / canvas.width
    const scaleY = rect.height / canvas.height

    const x = box.x * scaleX
    const y = box.y * scaleY
    const width = box.width * scaleX
    const height = box.height * scaleY

    return (
      <div
        ref={textBoxRef}
        className={styles.textBoxEditor}
        style={{
          left: x,
          top: y,
          width: width,
          height: height,
        }}
      >
        <textarea
          ref={textareaRef}
          className={styles.textBoxTextarea}
          defaultValue={box.text}
          style={{
            color: box.color,
            fontSize: `${box.fontSize * scaleY}px`,
            fontFamily: box.fontFamily,
            fontWeight: box.fontWeight,
            fontStyle: box.fontStyle,
            textAlign: box.textAlign === "justify" ? "left" : box.textAlign,
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
            overflow: "hidden",
            resize: "none",
          }}
          onBlur={finishTextBoxEditing}
          onInput={(e) => {
            // Atualizar texto em tempo real para preview
            const target = e.target as HTMLTextAreaElement
            if (editingTextBox) {
              setTextBoxes((boxes) =>
                boxes.map((box) => (box.id === editingTextBox ? { ...box, text: target.value } : box)),
              )
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              // Permitir quebras de linha com Shift+Enter
            } else if (e.key === "Enter") {
              e.preventDefault()
              finishTextBoxEditing()
            }
          }}
        />
        <div className={styles.textBoxControls}>
          <button
            className={styles.textBoxControl}
            onClick={() => {
              if (editingTextBox) {
                setTextBoxes((boxes) =>
                  boxes.map((box) =>
                    box.id === editingTextBox
                      ? { ...box, fontWeight: box.fontWeight === "bold" ? "normal" : "bold" }
                      : box,
                  ),
                )
              }
            }}
            title="Negrito"
          >
            <Bold size={14} />
          </button>
          <button
            className={styles.textBoxControl}
            onClick={() => {
              if (editingTextBox) {
                setTextBoxes((boxes) =>
                  boxes.map((box) =>
                    box.id === editingTextBox
                      ? { ...box, fontStyle: box.fontStyle === "italic" ? "normal" : "italic" }
                      : box,
                  ),
                )
              }
            }}
            title="Itálico"
          >
            <Italic size={14} />
          </button>
          <button
            className={styles.textBoxControl}
            onClick={() => {
              if (editingTextBox) {
                setTextBoxes((boxes) =>
                  boxes.map((box) => (box.id === editingTextBox ? { ...box, textAlign: "left" } : box)),
                )
              }
            }}
            title="Alinhar à esquerda"
          >
            <AlignLeft size={14} />
          </button>
          <button
            className={styles.textBoxControl}
            onClick={() => {
              if (editingTextBox) {
                setTextBoxes((boxes) =>
                  boxes.map((box) => (box.id === editingTextBox ? { ...box, textAlign: "center" } : box)),
                )
              }
            }}
            title="Centralizar"
          >
            <AlignCenter size={14} />
          </button>
          <button
            className={styles.textBoxControl}
            onClick={() => {
              if (editingTextBox) {
                setTextBoxes((boxes) =>
                  boxes.map((box) => (box.id === editingTextBox ? { ...box, textAlign: "right" } : box)),
                )
              }
            }}
            title="Alinhar à direita"
          >
            <AlignRight size={14} />
          </button>
          <button
            className={`${styles.textBoxControl} ${
              textBoxes.find((b) => b.id === editingTextBox)?.textAlign === "justify" ? styles.justifyButton : ""
            }`}
            onClick={() => {
              if (editingTextBox) {
                setTextBoxes((boxes) =>
                  boxes.map((box) => (box.id === editingTextBox ? { ...box, textAlign: "justify" } : box)),
                )
              }
            }}
            title="Justificar"
          >
            <AlignJustify size={14} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.editor}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolGroup}>
          <button
            className={`${styles.toolButton} ${tool === "select" ? styles.toolButtonActive : ""}`}
            onClick={() => setTool("select")}
            title="Selecionar"
          >
            <MousePointer className="h-4 w-4" />
          </button>
          <button
            className={`${styles.toolButton} ${tool === "draw" ? styles.toolButtonActive : ""}`}
            onClick={() => setTool("draw")}
            title="Desenhar"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            className={`${styles.toolButton} ${tool === "text" ? styles.toolButtonActive : ""}`}
            onClick={() => setTool("text")}
            title="Texto"
          >
            <Type className="h-4 w-4" />
          </button>
          <button
            className={`${styles.toolButton} ${tool === "textbox" ? styles.toolButtonActive : ""}`}
            onClick={() => setTool("textbox")}
            title="Caixa de Texto"
          >
            <Square className="h-4 w-4" />
          </button>
          <button
            className={`${styles.toolButton} ${tool === "erase" ? styles.toolButtonActive : ""}`}
            onClick={() => setTool("erase")}
            title="Apagar"
          >
            <Eraser className="h-4 w-4" />
          </button>
          <button
            className={`${styles.toolButton} ${tool === "move" ? styles.toolButtonActive : ""}`}
            onClick={() => setTool("move")}
            title="Mover"
          >
            <Move className="h-4 w-4" />
          </button>
        </div>

        {(tool === "draw" || tool === "erase") && (
          <div className={styles.toolGroup}>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className={styles.colorPicker}
              title="Cor do pincel"
            />
            <Slider
              value={brushSize}
              onValueChange={setBrushSize}
              min={1}
              max={20}
              step={1}
              className={styles.sizeSlider}
            />
          </div>
        )}

        {(tool === "text" || tool === "textbox") && (
          <div className={styles.toolGroup}>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className={styles.colorPicker}
              title="Cor do texto"
            />
            <Slider
              value={fontSize}
              onValueChange={setFontSize}
              min={8}
              max={48}
              step={1}
              className={styles.sizeSlider}
            />
            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className={styles.fontSelect}>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>
        )}

        <div className={styles.toolGroup}>
          <button className={styles.toolButton} onClick={undo} disabled={historyIndex <= 0} title="Desfazer">
            <Undo className="h-4 w-4" />
          </button>
          <button
            className={styles.toolButton}
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            title="Refazer"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className={styles.imageUpload}
        />
        <button className={styles.uploadButton} onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-4 w-4 mr-1" />
          Imagem
        </button>
      </div>

      {/* Canvas */}
      <div className={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className={getCanvasClass()}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            width: "100%",
            height: "auto",
            maxWidth: `${canvasSize.width}px`,
            maxHeight: `${canvasSize.height}px`,
          }}
        />
        {renderResizeHandles()}
        {renderTextBoxEditor()}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <div>
          <button className={styles.actionButton} onClick={clearCanvas}>
            <Trash2 className="h-4 w-4 mr-1" />
            Limpar
          </button>
          <button className={styles.actionButton} onClick={downloadImage}>
            <Download className="h-4 w-4 mr-1" />
            Baixar
          </button>
        </div>
        <button className={`${styles.actionButton} ${styles.saveButton}`} onClick={handleSave}>
          <Save className="h-4 w-4 mr-1" />
          Salvar Partitura
        </button>
      </div>
    </div>
  )
}
