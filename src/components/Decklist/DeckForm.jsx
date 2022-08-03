import { DeckFormStyles } from './styles.css'
import downloadIcon from '../../assets/download-file.png'
import uploadIcon from '../../assets/upload-file.png'
import PropTypes from 'prop-types'

const DeckForm = ({ onFormChange, onDownload, onUpload }) => {
  return (
    <div css={DeckFormStyles}>
      <form>
        <input type="text" name="name" placeholder="Name" onChange={(e) => onFormChange(e)} />
        <input type="text" name="lastname" placeholder="Lastname" onChange={(e) => onFormChange(e)} />
        <input type="text" name="playerId" placeholder="Konami Player ID" onChange={(e) => onFormChange(e)} />
        <input type="date" name='date' placeholder='Event Date: ' onChange={(e) => onFormChange(e)} />
        <input type="text" name="event" placeholder="Event Name" onChange={(e) => onFormChange(e)} />
        <div className="actions-pdf-container">
          <div className="image-upload">
            <label htmlFor="file-input">
              <img src={uploadIcon} title="Upload YDK Decklist" alt='Upload YDK File icon'></img>
            </label>
            <input id="file-input" name="foto" type="file" onChange={(e) => onUpload(e)}/>
          </div>
          <img src={downloadIcon} onClick={onDownload} title="Download PDF Decklist" alt='Download PDF File icon'></img>
        </div>
      </form>
    </div>
  )
}

DeckForm.propTypes = {
  onFormChange: PropTypes.func,
  onDownload: PropTypes.func,
  onUpload: PropTypes.func
}

export default DeckForm
