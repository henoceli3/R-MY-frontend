import React, { useEffect, useState } from "react";

// import { Helmet } from 'react-helmet';
import { Provider } from "react-redux";
import store from "../../../shared/redux/store";
import dynamic from "next/dynamic";

// import TabToTop from "../tab-to-top/tab-to-top";
import { useRouter } from "next/router";
// import Header from "../header/header";
const Switcher = dynamic(
  () => import("../../../shared/layout-components/switcher/switcher"),
  { ssr: false }
);
const Sidebar = dynamic(
  () => import("../../../shared/layout-components/sidebar/sidebar"),
  { ssr: false }
);

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Script from "next/script";
import Footer from "../../../shared/layout-components/footer/footer";
import Rightside from "../../../shared/layout-components/right-sidebar/right-sidebar";
import TabToTop from "../../../shared/layout-components/tab-to-top/tab-to-top";
import Header from "../../../shared/layout-components/header/header";
import { Helmet } from "react-helmet";
import { Box, Button, Input, Modal, Select } from "@mui/material";

import axios from "axios";

export default function UsersIn() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function createData(
    Role = string,
    Right = string,

  ) {
    return { Role, Right };
  }
  const rows = [
    createData("Admin", "777"),
    createData("Employee", "775"),
    createData("Gestionnaire", "775")
  ];


  // recuperation de la liste des roles 
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:4000/api/role', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
      });
  }, [data])


  // supprimer un role
  const deleteRole = (id) => {
    axios.delete(`http://localhost:4000/api/role/${JSON.stringify(id)}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {

      })
      .catch((error) => {

      });
  }

  //reçois les données saisies pour la creation ou la modification d'un role
  const [newRole, setNewRole] = useState({
    "label": "",
  });

  const { label } = newRole;
  const changeHandler = (e) => {
    setNewRole({ ...newRole, [e.target.name]: e.target.value })
  }

  //variable pour savoir si le bouton valider lance la modif ou la création update ou enregirstrer
  const [createOrUpdate, setCreateOrUpdate] = useState(null);

  const creatRole = (e) => {
    axios.post('http://localhost:4000/api/role', JSON.stringify(newRole), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {
        // vider les champs un fois la requette est reussie
        setNewRole({
          "label": "",
        });
        handleClose();
      })
      .catch((error) => {
      });
  }

  // contient l'id du user qui sera modif 
  const [idRole, setIdRole] = useState(null);

  // update role
  const updatRole = (e) => {
    axios.put(`http://localhost:4000/api/role/${JSON.stringify(idRole)}`, JSON.stringify(newRole), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {
        // vider les champs un fois que la requette est reussie
        console.log(response.data.message)
        setNewRole({
          "label": "",
        });
        handleClose();
      })
      .catch((error) => {
        console.log(error.response.data.message)
        handleClose()
      });
  }

  // determine la fonction qui sera lance en fonction de la var createOrUpdate
  const CrtUpdt = (e) => {
    if (createOrUpdate) {
      creatRole();
    } else {
      updatRole(e);
    }
  }

  const setField = (label) => {
    setNewRole({
      "label": label,
    });
  }

  return (
    <>
      <Helmet>
        <body className="ltr main-body leftmenu"></body>
      </Helmet>
      <Provider store={store}>
        <div className="horizontalMenucontainer">
          <div className="page">
            <Header />
            <Sidebar />

            <div className="main-content side-content pt-0">

              <div
                className="main-container container-fluid"
              // onClick={() => remove()}
              >
                <h1 color="red"></h1>
                <div className="inner-body" >
                  <Button
                    onClick={() => {
                      setCreateOrUpdate(true);
                      handleOpen();
                      setNewRole({
                        "label": "",
                      });
                    }}
                    className="float-md-right col-md-4"
                  >CREER UN ROLE</Button>

                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                    sx={{ marginLeft: '30%' }}
                  >
                    <Box width={450} bgcolor={"white"} mt={10} pl={2} pt={2}>
                      <Input
                        type="text" placeholder="Label" sx={{ marginBottom: '2em' }}
                        name="label" value={label} onChange={changeHandler}
                      /><br></br>

                      <Button
                        onClick={handleClose} sx={{ color: 'gray' }}
                      >fermer</Button>

                      <Button
                        color="primary" variant="contained"
                        sx={{ marginLeft: '1em' }}
                        onClick={() => { CrtUpdt() }}
                      >Valider</Button>

                    </Box>
                  </Modal>
                  <TableContainer component={Paper} bgcolor={"white"} variant="outlined" sx={{ backgroundColor: 'white', colorScheme: 'white' }} >
                    <Table sx={{ backgroundColor: 'white', minWidth: 200, maxwidth: 320, colorScheme: 'white' }} bgcolor={"white"} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Nom</TableCell>
                          <TableCell align="center">Role</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((role) => (
                          <TableRow
                            key={role.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell align="center">
                              {role.id}
                            </TableCell>
                            <TableCell align="center">
                              {role.label}
                            </TableCell>
                            <TableCell align="center" sx={{ display: 'flex', justifyContent: 'space-around' }}>
                              <i
                                className="fas fa-edit col-md-3 " role="button"
                                onClick={() => {
                                  setCreateOrUpdate(false);
                                  setField(role.label);
                                  setIdRole(role.id);
                                  handleOpen();
                                }}
                              ></i>
                              <i
                                className="fas fa-trash-alt " role="button"
                                onClick={() => deleteRole(role.id)}
                              ></i>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            </div>
            <Rightside />
          </div>

          <Switcher />
          <TabToTop />
          <Footer />
        </div>
      </Provider>
    </>
  );
}
