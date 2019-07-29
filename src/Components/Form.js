import React from 'react'
import { post } from 'axios';

class Form extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      inputKey: Date.now(),
      file:null,
      headers: [],
      separator: '',
      fields:{}
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
    this.onChangeSeparador = this.onChangeSeparador.bind(this)
    this.extractHeaders = this.extractHeaders.bind(this)
    this.renderSelect = this.renderSelect.bind(this)
    this.handleChangeSelect = this.handleChangeSelect.bind(this)
  }
  onFormSubmit(e){
    e.preventDefault() // Stop form submit
    this.fileUpload().then((response)=>{
      this.setState({
        inputKey: Date.now(),
        file:null,
        headers: [],
        separator: '',
        fields:{}
      })
    })
  }

  onChange(e) {
    this.setState({file:e.target.files[0]})
    this.extractHeaders(e.target.files[0]);
  }

  onChangeSeparador(e){
    this.setState({separator:e.target.value})
  }

  handleChangeSelect(header, event) {
    const { fields } = this.state;
    const field = {[event.target.value]: header}
    this.setState({fields: {...fields, ...field}});
  }

  extractHeaders(file) {
    let reader = new FileReader();
    const { separator } = this.state;
    reader.onload = (e) => {
        let text = reader.result;
        let firstLine = text.split('\n').shift(); 
        this.setState({headers: firstLine.split(separator)});
    }
    reader.readAsText(file, 'UTF-8'); 
  } 

  fileUpload(){
    const url = 'http://localhost:8000/upload';
    const { file, fields, separator } = this.state;
    const formData = new FormData();
    formData.append('file',file)
    formData.append('separator',separator)
    formData.append('fields',JSON.stringify(fields))
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }    
    return  post(url, formData,config)
  }

  renderSelect(header) {
    return (
      <select onChange={(e)=>this.handleChangeSelect(header, e)} className="form-control" id="select-input">
        <option>Seleccionar</option>
        <option value="firstName">Nombres</option>
        <option value="lastName">Apellidos</option>
        <option value="phone">Telefono</option>
        <option value="address">Dirección</option>
      </select>
    );
  }

  render() {
    const { headers, separator, inputKey } = this.state;
    return (
      <div className="card">
        <div className="card-body">
          <h1>Carga de Datos</h1>
          <form onSubmit={this.onFormSubmit} className="col-md-12">
            <div className="form-group">
              <label htmlFor="separator-input">Separador</label>
              <input type="text" className="form-control" id="separator-input"  onChange={this.onChangeSeparador} value={separator}/>
            </div>
            <div className="form-group">
              <label htmlFor="file-input">Archivo</label>
              <input type="file" onChange={this.onChange} className="form-control-file" id="file-input" key={inputKey}/>
            </div>
            <h2>Campos</h2>
            { 
              headers.map((header, key) => (
                <div className="form-group">
                  <label htmlFor="select-input">{header}</label>
                  {this.renderSelect(key)}
                </div>
              ))
            }
            <button type="submit" className="btn btn-primary">Cargar</button>
          </form>
        </div>
      </div>
   )
  }
}



export default Form