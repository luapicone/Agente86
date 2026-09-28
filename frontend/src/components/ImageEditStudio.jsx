import { useState } from 'react'
import { editRender } from '../services/renderApi'

function ImageEditStudio({ item, onApply, onClose }) {
  const [currentImageUrl, setCurrentImageUrl] = useState(item.imageUrl)
  const [instruction, setInstruction] = useState('')
  const [messages, setMessages] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const requestedChange = instruction.trim()

    if (!requestedChange || isEditing) return

    setError('')
    setInstruction('')
    setMessages((current) => [...current, { role: 'user', text: requestedChange }])
    setIsEditing(true)

    try {
      const response = await editRender({
        imageUrl: currentImageUrl,
        instruction: requestedChange,
        title: item.title,
      })
      const nextImageUrl = response?.render?.imageUrl

      if (!nextImageUrl) throw new Error('fal.ai no devolvió una imagen modificada.')

      setCurrentImageUrl(nextImageUrl)
      setMessages((current) => [
        ...current,
        { role: 'assistant', text: 'Listo. Apliqué el cambio sobre esta misma vista.' },
      ])
      onApply(item.id, nextImageUrl)
    } catch (requestError) {
      setError(requestError.message)
      setMessages((current) => [
        ...current,
        { role: 'assistant', text: 'No pude aplicar ese cambio. Revisá la indicación e intentá de nuevo.' },
      ])
    } finally {
      setIsEditing(false)
    }
  }

  return (
    <section className="image-edit-studio" aria-label={`Editar ${item.title}`}>
      <div className="image-edit-preview">
        <img src={currentImageUrl} alt={`Versión editable de ${item.title}`} />
        <div className="image-edit-badge">FLUX.2 Pro Edit</div>
      </div>

      <div className="image-edit-chat">
        <div className="image-edit-header">
          <div>
            <span className="section-kicker">Edición por conversación</span>
            <h3>{item.title}</h3>
          </div>
          <button type="button" className="image-edit-close" onClick={onClose} aria-label="Cerrar editor">
            ×
          </button>
        </div>

        <p className="image-edit-help">
          Pedí cambios concretos. La IA conserva el ambiente, el encuadre y todo lo que no menciones.
        </p>

        <div className="image-edit-messages" aria-live="polite">
          <div className="image-edit-message image-edit-message--assistant">
            ¿Qué querés modificar? Por ejemplo: “cambiá el piso por madera clara” o “agregá una isla central”.
          </div>
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`image-edit-message image-edit-message--${message.role}`}>
              {message.text}
            </div>
          ))}
          {isEditing ? (
            <div className="image-edit-message image-edit-message--assistant image-edit-message--loading">
              Diseñando la nueva versión…
            </div>
          ) : null}
        </div>

        {error ? <div className="alert alert-danger py-2">{error}</div> : null}

        <form className="image-edit-form" onSubmit={handleSubmit}>
          <label htmlFor="image-edit-instruction" className="visually-hidden">Modificación solicitada</label>
          <textarea
            id="image-edit-instruction"
            value={instruction}
            onChange={(event) => setInstruction(event.target.value)}
            placeholder="Ej.: mantené todo igual y pintá las paredes en verde oliva…"
            rows="3"
            disabled={isEditing}
          />
          <button className="btn btn-success" type="submit" disabled={isEditing || !instruction.trim()}>
            {isEditing ? 'Generando…' : 'Aplicar modificación'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default ImageEditStudio
