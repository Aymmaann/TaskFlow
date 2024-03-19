import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    selectedFile: null,
    fileUploadedSuccessfully: false
  }

  onFileChange = event => {
    this.setState({ selectedFile: event.target.files[0] });
  }

  onFileUpload = () => {
    const formData = new FormData();
    formData.append(
      "demo file",
      this.state.selectedFile, 
      this.state.selectedFile.name
    )
    // API call 
    console.log(formData);
    this.setState({selectedFile : null});
    this.setState({fileUploadedSuccessfully : true});
  }

  fileData = () => {
    if (this.state.selectedFile) {
      return (
        <div className="file-details">
          <h3>File Details</h3>
          <p>File Name: {this.state.selectedFile.name}</p>
          <p>File Type: {this.state.selectedFile.type}</p>
          <p>Last Modified: {this.state.selectedFile.lastModifiedDate.toDateString()}</p>
        </div>
      );
    } else if (this.state.fileUploadedSuccessfully) {
      return (
        <div className="success-message">
          <h3>Your file has been successfully uploaded</h3>
        </div>
      );
    } else {
      return (
        <div className="info-message">
          <br/>
          <h3>Choose a file and then press the Upload button</h3>
        </div>
      );
    }
  }
  render() {
    return (
      <div>

        <nav className="navbar">
          <div className="navbar-brand">TaskFlow</div>
        </nav>

        <div className='container'>

          <h1 className="main_header">Task Flow</h1>
          <hr></hr>
          <h4>File upload now made easier than ever with React and a Serverless API</h4>

          <div className="file-upload-section">
            <label htmlFor="file-upload" className="custom-file-upload">
              Choose File
            </label>
            <input id="file-upload" type="file" onChange={this.onFileChange} />
            <button className="upload-btn" onClick={this.onFileUpload}>
              Upload
            </button>
          </div>
          {this.fileData()}
        </div>

        
        <div className='footer'>
        <div className="row">
          <div className="contact-left">
            <h1 className="sub-title skill">Contact Us</h1>
            <p><i className="fa-solid fa-paper-plane"></i>  Taskflow@gmail.com</p>
            <p><i className="fa-solid fa-phone"></i>  123-456-7890</p>
          </div>
          <div className="contact-right">
            <form action="">
              <input type="text" name="Name" placeholder="Your Name" required />
              <input type="email" name="email" id="" placeholder="Your Email" required />
              <button type="submit" className="btn2">Submit</button>
            </form>
          </div>
        </div>
        </div>
      </div>
    );
  }
}

export default App;