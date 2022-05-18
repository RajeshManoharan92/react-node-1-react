import React from 'react';
import axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Form, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Grid, Select, Item } from '@mui/material';
import { Formik } from 'formik';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import './index.css';


class CRUD extends React.Component {

  constructor() {
    super();
    this.state = {
      Product: [],
      ProductName: '',
      Productcompany: '',
      Productprice: '',
      _id: '',
    }
  }
// geting datas from mongedb Atlas on pageload

  async componentDidMount() {
    var response = await axios.get('http://localhost:3001/product/get')
    await this.setState({ Product: response.data })


  }

// setting up errors on leaving text-field blank

  validate = (formData) => {
    var errors = {};
    if (formData.ProductName == '') errors.ProductName = 'ProductName is Required';
    if (formData.Productcompany == '') errors.Productcompany = 'Productcompany is Required';
    if (formData.Productprice == '') errors.Productprice = 'Productprice is Required';
    if (formData.Gender == '') errors.Gender = 'Gender is Required';
    return errors;
  };

// onsubmit event

  submit = async (formData) => {

    // update data 

    if (this.state._id) {
      var update = await axios.put(`http://localhost:3001/product/update/${this.state._id}`,
        {
          ProductName: formData.ProductName,
          Productcompany: formData.Productcompany,
          Productprice: formData.Productprice
        })

      var response = await axios.get('http://localhost:3001/product/get')
      await this.setState({ Product: response.data })
      this.setState({ ProductName: '', Productcompany: '', Productprice: '', _id: '' })

    }

    // create data

    else {
      var post = await axios.post('http://localhost:3001/product/post', {
        ProductName: formData.ProductName,
        Productcompany: formData.Productcompany,
        Productprice: formData.Productprice,

      })

      var response = await axios.get('http://localhost:3001/product/get')
      console.log(response)
      await this.setState({ Product: response.data })
      this.setState({ ProductName: '', Productcompany: '', Productprice: '', _id: '' })
    }
  }



  render() {

    // edit button 

    const Update = async (_id) => {
      var selectedData = await this.state.Product.filter((row) => row._id == _id)[0]
      await this.setState({
        ProductName: selectedData.ProductName,
        Productcompany: selectedData.Productcompany,
        Productprice: selectedData.Productprice,
        _id: selectedData._id
      })
    }


    // delete button

    const Delete = (_id) => {
      var response = axios.delete(`http://localhost:3001/product/delete/${_id}`)
      var Product = this.state.Product.filter((row) => row._id !== _id)
      this.setState({ Product })
    }

    return (
      <>
        {/* Top content */}

        <div class="container-fluid" >
          <div >
            <Box sx={{ flexGrow: 1 }}>
              <AppBar position="static">
                <Toolbar >
                  <span className="Box">Product Creation Using Formik With CRUD Using Node.js(Mongodb-Atlas)</span>
                </Toolbar>
              </AppBar>
            </Box>
          </div>
        </div>

        <Formik
          enableReinitialize
          initialValues={this.state}
          validate={(formData) => this.validate(formData)}
          onSubmit={(formData) => this.submit(formData)}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (

              // form datas

            <form className='form' onSubmit={handleSubmit}>
              
              {/* Input field - Product Name */}

              <div class="container-xl" >
                <div >
                  <label>Product Name</label> &nbsp;
                  <div className='input1' style={{ display: 'inline-block' }}>
                    <Box component="form" noValidate autoComplete="off">
                      <FormControl sx={{ width: '35ch' }}>
                        <OutlinedInput placeholder="Please enter ProductName" type="text"
                          name="ProductName"
                          value={values.ProductName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className='input1' />
                      </FormControl>
                    </Box>
                  </div>
                  <br />
                  <span style={{ color: 'red' }}>
                    {touched.ProductName && errors.ProductName}
                  </span>
                </div>
              </div>
              <br></br>

            {/* Input field - Product Company */}

              <div class="container-xl" >
                <div>
                  <label>Product Company</label> &nbsp;
                  <div className='input2' style={{ display: 'inline-block' }}>
                    <Box component="form" noValidate autoComplete="off">
                      <FormControl sx={{ width: '35ch' }}>
                        <OutlinedInput placeholder="Please enter Productcompany" type="text"
                          name="Productcompany"
                          value={values.Productcompany}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className='input2' />
                      </FormControl>
                    </Box>
                  </div>
                  <br />
                  <span style={{ color: 'red' }}>
                    {touched.Productcompany && errors.Productcompany}
                  </span>
                </div>
              </div>
              <br></br>

            {/* Input field - Product Price */}

              <div class="container-xl" >
                <div>
                  <label>Product Price</label> &nbsp;
                  <div className='input3' style={{ display: 'inline-block' }}>
                    <Box component="form" noValidate autoComplete="off">
                      <FormControl sx={{ width: '35ch' }}>
                        <OutlinedInput placeholder="Enter Only Numbers" type="number"
                          name="Productprice"
                          value={values.Productprice}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className='input3'
                        />
                      </FormControl>
                    </Box>
                  </div>
                  <br />
                  <span style={{ color: 'red' }}>
                    {touched.Productprice && errors.Productprice}
                  </span>
                </div>
              </div>
              <br></br>

          {/* Submit Button */}

              <div class="container-fluid" >
                <div className='Submitbutton'>
                  <Button type="submit" variant="contained" disabled={isSubmitting} >submit</Button> &nbsp;
                </div>
              </div>
              <br></br>
            </form>
          )}
        </Formik>

        {/* Table */}

        <div class="container-fluid" >
          <div className="grid">
            <Grid container spacing={2}>
              <Grid xs={8}>
                <Table striped bordered hover variant="primary" border='1'>
                  <thead>
                    <tr>
                      <td> Product Name </td>
                      <td> Product company </td>
                      <td> Product price </td>
                      <td> Actions </td>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.Product.map((row) => (
                      <tr>
                        <td> {row.ProductName} </td>
                        <td> {row.Productcompany} </td>
                        <td> {row.Productprice} </td>
                        <td> <Button variant="contained" onClick={() => Update(row._id)} >Edit</Button> &nbsp; &nbsp; &nbsp;
                          <Button variant="contained" onClick={() => Delete(row._id)} >Delete</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Grid>
            </Grid>
          </div>
        </div>
      </>
    );
  }
}

export default CRUD
