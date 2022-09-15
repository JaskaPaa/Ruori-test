
import React, {useState} from 'react';

import axios from 'axios'

const Notes = () => {

  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('Testi testi')

  const base = 'http://localhost:5000/api'

  /*
  fetch(base)
    .then(res => res.text())
    .then(res => console.log(res))
    .catch(err => err);
  */
  
  axios
    .get(base + '/notes')
    .then(response => {
      const notes = response.data
      console.log(notes)
    })
  
  const getAll = () => {
    console.log("Haetaa dataa...")
    axios
      .get(base + '/notes')
      .then(response => {
        const notes = response.data
        console.log(notes)
        setNotes(JSON.stringify(notes))
      })
  }

  return (
    <div>
      <div>
        <button onClick={() => getAll()}>
          Hae
        </button>
      </div>
      <p>Turha</p>
      <p>{notes}</p>
    </div>
  )
}

const Upload = () => {
  const [uploadedFile, setUploadedFile] = useState ('');
  const [fileTitle, setFileTitle] = useState ('');

  function handleFormSubmittion (e) {
    e.preventDefault ();

    let form = document.getElementById ('form');
    let formData = new FormData (form);

    // do something
    console.log("Form submitted");
    axios.post ('http://localhost:5000/upload', formData)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  function handleFileTitle (e) {
    setFileTitle (e.target.value);
  }

  function handleUploadedFile (e) {
    setUploadedFile (e.target.value);
  }

  return (
    <React.Fragment>
      <h1>File upload</h1>
      <form
        encType="multipart/form-data"
        onSubmit={handleFormSubmittion}
        id="form"
        name="foo"
      >
        <input
          type="file"
          name="uploadedFile"
          value={uploadedFile}
          onChange={handleUploadedFile}
          required
        />
        <br />
        <br />

        <label>File title:</label><br />
        <input
          type="text"
          placeholder="Enter file title"
          name="fileTitle"
          value={fileTitle}
          onChange={handleFileTitle}
          required
        />
        <br />
        <br />

        <button type="submit">Submit Form</button>
      </form>      
    </React.Fragment>
  );
}



const App = () => {

  const [downloadFile, setDownloadFile] = useState ('');

  function handleDownloadFile (e) {

    setDownloadFile(e.target.value.replace('.', '_'));
  }

  function handleSubmit(event) {
    event.preventDefault();
    
    // do something
    console.log("Form submitted");
    
    axios({
      url: 'http://localhost:5000/single/'+ downloadFile,
      method:'GET',
      responseType: 'blob'
      })
      .then((response) => {
        const url = window.URL
          .createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', downloadFile.replace('_', '.'));
        document.body.appendChild(link);
        link.click();
        console.log('Downloaded file: ' + downloadFile.replace('_', '.'));
      })
      .catch((error) => {
        console.log(error.toJSON());
      });
  }

  return (
    <div>
      <h1>Ruori</h1>
      <Notes />
      <Upload />
      <br />
      <form onSubmit={handleSubmit} >
        <input type="text" id="filename" name="filename" value={downloadFile} onChange={handleDownloadFile} /><br />
        <button type="submit">Download Single File</button>
      </form>
    </div>
  )
}

export default App;
