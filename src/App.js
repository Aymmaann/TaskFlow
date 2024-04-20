import React, { useState, useEffect } from 'react';
import './App.css';
import AWS from 'aws-sdk';
import JSZip from 'jszip'; 
import { IoIosMail } from 'react-icons/io';
import { FaPhone } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router';
import { MdDeveloperMode } from 'react-icons/md';

const S3_BUCKET = 'amplify-taskflow-s3966b3-dev';
const REGION = 'eu-north-1';

AWS.config.update({
  accessKeyId: process.env.local.ACCESS_KEY,
  secretAccessKey: process.env.local.SECRET_ACCESS_KEY
})

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

const App = () => {
  const { auth } = useAuth();
  const nav = useNavigate();
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchFileList();
  }, []);

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  useEffect(() => {
    if (!auth) {
      nav('/login');
    }
  }, [auth]);

  const uploadFile = async (file) => {
    const params = {
      ACL: 'public-read',
      Body: file,
      Bucket: S3_BUCKET,
      Key: file.name,
    };

    setIsLoading(true);

    try {
      await myBucket
        .putObject(params)
        .on('httpUploadProgress', (evt) => {
          setProgress(Math.round((evt.loaded / evt.total) * 100));
        })
        .promise();
      setIsLoading(false);
      fetchFileList();
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsLoading(false);
    }
  };

  const fetchFileList = async () => {
    try {
      const data = await myBucket.listObjectsV2({}).promise();
      setFileList(data.Contents);
    } catch (error) {
      console.error('Error fetching file list:', error);
    }
  };

  const fileData = () => {
    if (selectedFile || isLoading) {
      return (
        <div className="file-details">
          {isLoading && (
            <div className="upload-progress file-details">
              <br />
              <div className="spinner file-details"></div>
              {/* <h3 className="file-details">Uploading...</h3> */}
              <h3 className="file-details">Progress: {progress}%</h3>
            </div>
          )}
          {selectedFile && (
            <div className="file-details">
              <h3 className="file-details">File Details</h3>
              <p className="file-details">File Name: {selectedFile.name}</p>
              <p className="file-details">File Type: {selectedFile.type}</p>
              <p className="file-details">
                Last Modified: {selectedFile.lastModifiedDate.toDateString()}
              </p>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="info-message">
          <br />
          <h4 className="info-message">Choose a file and press the Upload button</h4>
        </div>
      );
    }
  };

  const compressFile = async (fileName) => {
    try {
      const fileContent = await myBucket.getObject({ Bucket: S3_BUCKET, Key: fileName }).promise();
      const zip = new JSZip();
      zip.file(fileName, fileContent.Body);
      const content = await zip.generateAsync({ type: 'blob' });
      const compressedFile = new File([content], `${fileName}.zip`, { type: 'application/zip' });
      await uploadFile(compressedFile);
    } catch (error) {
      console.error('Error compressing file:', error);
    }
  };

  const renderFileList = () => {
    // Sort the fileList array by LastModified in descending order
    const sortedFileList = fileList.sort((a, b) => {
      return new Date(b.LastModified) - new Date(a.LastModified);
    });
  
    if (sortedFileList.length === 0) {
      return (
        <div className="file-list">
          <h2 className="file-header-background">No files uploaded yet</h2>
        </div>
      );
    } else {
      return (
        <div className="file-list">
          <h2 className="file-header-background">Uploaded Files</h2>
          <table className="log-table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Download</th>
                <th>Delete</th>
                <th>Update</th>
                <th>Compress</th>
              </tr>
            </thead>
            <tbody>
              {sortedFileList.map((file, index) => (
                <tr key={index}>
                  <td>{file.Key}</td>
                  <td>
                    <button onClick={() => downloadFile(file.Key)}>Download</button>
                  </td>
                  <td>
                    <button onClick={() => deleteFile(file.Key)}>Delete</button>
                  </td>
                  <td>
                    <button onClick={() => updateFile(file.Key)}>Update</button>
                  </td>
                  <td>
                    <button onClick={() => compressFile(file.Key)}>Compress</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };
  

  const downloadFile = async (fileName) => {
    try {
      const url = await myBucket.getSignedUrl('getObject', { Bucket: S3_BUCKET, Key: fileName });
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const deleteFile = async (fileName) => {
    try {
      await myBucket.deleteObject({ Bucket: S3_BUCKET, Key: fileName }).promise();
      fetchFileList(); 
      alert(`${fileName} has been successfully deleted!`);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const updateFile = async (fileName) => {
    try {
      const newFileName = prompt('Enter new file name:');
      if (newFileName) {
        await myBucket
          .copyObject({
            Bucket: S3_BUCKET,
            CopySource: `${S3_BUCKET}/${fileName}`,
            Key: newFileName,
          })
          .promise();
        await myBucket.deleteObject({ Bucket: S3_BUCKET, Key: fileName }).promise();
        fetchFileList(); // Update file list after update
        alert(`${fileName} has been renamed to ${newFileName}`);
      }
    } catch (error) {
      console.error('Error updating file:', error);
    }
  };

  return (
    <div className="BackGround-image">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1 className="navbar-name">
            <MdDeveloperMode className="navbar-logo" />
            TaskFlow
          </h1>
        </div>
      </nav>
      <div className="container">
        <h1 className="main_header">TaskFlow</h1>
        <hr></hr>
        <h3 className="main_header text">
          File upload now made easier than ever with React and a Serverless API
        </h3>

        <div className="file-upload-section">
          <label htmlFor="file-upload" className="custom-file-upload">
            Choose File
          </label>
          <input id="file-upload" type="file" onChange={handleFileInput} />
          <button className="upload-btn" onClick={() => uploadFile(selectedFile)}>
            Upload
          </button>
        </div>
        {fileData()}
      </div>

      <div className="file-container"> {renderFileList()} </div>

      <div className="footer">
        <div className="row">
          <div className="contact-left">
            <h1 className="sub-title skill">Contact Us</h1>
            <p className="gmail">
              <IoIosMail className="footer-icon" /> Taskflow@gmail.com
            </p>
            <p className="gmail">
              <FaPhone className="footer-icon" /> 123-456-7890
            </p>
          </div>
          <div className="contact-right">
            <form action="" className='footer-form'>
              <input type="text" name="Name" placeholder="Your Name" required />
              <input type="email" name="email" id="" placeholder="Your Email" required />
              <button type="submit" className="btn2">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
