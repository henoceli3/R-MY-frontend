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
import { Box, Button, Divider, Input, Modal, Select, Typography } from "@mui/material";
import axios from "axios";
import { Label } from "@material-ui/icons";
export default function UsersIn() {
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleB = () => {
    setClose(true);
  };
  const handleB2 = () => {
    setClose(false);
  };

  function createData(
    name = string,
    surname = number,
    number = number,
    email = number,
    role = string
  ) {
    return { name, surname, number, email, role };
  }
  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, " 4/3"),
    createData("Ice cream sandwich", 237, 9.0, 37, "0/5"),
    createData("Eclair", 262, 16.0, 24, "2/8"),
    createData("Cupcake", 305, 3.7, 67, "Terminée"),
    createData("Gingerbread", 356, 16.0, 49, "3/9"),
  ];

  // recuperation de la liste des obligation 
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:4000/api/obligation', {
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

  // supprimer une role
  const deleteObligation = (id) => {
    axios.delete(`http://localhost:4000/api/obligation/${JSON.stringify(id)}`, {
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

  //reçois les données saisies pour la creation ou la modification d'un utilisateur 
  const [newObligation, setNewObligation] = useState({
    "titre": "",
    "description": "",
    "date_echeance": "",
    "date_creation": "",
    "date_maj": new Date().toISOString().slice(0, 10),
    "id_entite": ""
  });

  const { titre, description, date_creation, date_echeance, date_maj, id_entite } = newObligation;
  const changeHandler = (e) => {
    setNewObligation({ ...newObligation, [e.target.name]: e.target.value })
  }

  //variable pour savoir si le bouton valider lance la modif ou la création update ou enregirstrer
  const [createOrUpdate, setCreateOrUpdate] = useState(null);

  const creatObligation = (e) => {
    axios.post('http://localhost:4000/api/obligation', JSON.stringify(newObligation), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {
        // vider les champs un fois la requette est reussie
        setNewObligation({
          "titre": "",
          "description": "",
          "date_echeance": "",
          "date_creation": new Date().toISOString().slice(0, 10),
          "date_maj": "",
          "id_entite": ""
        });
        handleClose();
      })
      .catch((error) => {
        console.log(error.response.data.data)

      });
  }

  // contient l'id de l'obligation qui sera modif 
  const [idObligation, setIdObligation] = useState(null);

  // update modif
  const updatObligation = (e) => {
    axios.put(`http://localhost:4000/api/obligation/${JSON.stringify(idObligation)}`, JSON.stringify(newObligation), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {
        // vider les champs un fois que la requette est reussie
        console.log(response.data.message)
        setNewObligation({
          "titre": "",
          "description": "",
          "date_echeance": "",
          "date_creation": "",
          "date_maj": "",
          "id_entite": ""
        });
        handleClose();
      })
      .catch((error) => {
        console.log(error.response.data.data)
        handleClose()
      });
  }

  // determine la fonction qui sera lance en fonction de la var createOrUpdate
  const CrtUpdt = (e) => {
    if (createOrUpdate) {
      creatObligation();
    } else {
      updatObligation(e);
    }
  }

  const setField = (titre, description, date_echeance, date_creation, date_maj, id_entite) => {
    setNewObligation({
      "titre": titre,
      "description": description,
      "date_echeance": date_echeance,
      "date_creation": date_creation,
      "date_maj": date_maj,
      "id_entite": id_entite
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
                  <Box display={'flex'} flexDirection="row-reverse"  >
                    <Button
                      onClick={() => {
                        handleOpen();
                        setCreateOrUpdate(true);
                        setNewObligation({
                          "titre": "",
                          "description": "",
                          "date_echeance": "",
                          "date_creation": "",
                          "date_maj": "",
                          "id_entite": ""
                        });
                      }}
                      sx={{ bgcolor: 'blue', colorScheme: 'blue', color: "white", marginLeft: "20px" }}
                    >CREER OBLIGATION</Button>

                    <Button onClick={handleB} sx={{ bgcolor: 'indigo', colorScheme: 'indigo', color: "white" }}>GENERER RAPPORT</Button>
                  </Box>

                  {/* creation d'une obligations  */}
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                    sx={{ marginLeft: '30%' }}
                  >
                    <Box width={450} bgcolor={"white"} mt={10} pl={2} pt={2} pb={3}>
                      <Input
                        type="text" placeholder="Titre" sx={{ marginBottom: 1, marginRight: 5 }}
                        name="titre" value={titre} onChange={changeHandler}
                      />
                      <Input
                        type="text" placeholder="description"
                        name="description" value={description} onChange={changeHandler}
                      /><br /><br />

                      <label>date de création</label>
                      <Input
                        type="date" placeholder="date de creation"
                        sx={{ marginBottom: 1, marginLeft: 5 }}
                        name="date_creation" value={date_creation} onChange={changeHandler}
                      /><br /><br />

                      <label>date d écheance</label>
                      <Input
                        type="date" placeholder="date d'echeance" sx={{ marginBottom: 1, marginLeft: 5 }}
                        name="date_echeance" value={date_echeance} onChange={changeHandler}
                      /><br /><br />

                      <label>date de mise a jours</label>
                      <Input
                        type="date" placeholder="date de creation" sx={{ marginBottom: 1, marginLeft: 5 }}
                        name="date_maj" value={date_maj} onChange={changeHandler}
                      /><br /><br />

                      <Input
                        type="number" placeholder="id de l'entité"
                        name="id_entite" value={id_entite} onChange={changeHandler}
                      /> <br /><br />

                      <Button onClick={handleClose} sx={{ backgroundColor: 'grey', color: "white" }}>fermer</Button>
                      <Button
                        sx={{ backgroundColor: 'blue', color: "white", marginLeft: "10px" }}
                        onClick={() => {
                          CrtUpdt();
                        }}
                      >Valider</Button>
                    </Box>
                  </Modal>

                  {/* telechargement d'une obligation  */}
                  <Modal
                    open={close}
                    onClose={handleB2}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                    sx={{ marginLeft: '30%' }}
                  >
                    <Box width={450} bgcolor={"white"} mt={10} pl={2} pt={2} border={'2px solid black'} boxShadow={10} borderRadius={5}>
                      TRIER PAR :
                      <select className="col-md-5">
                        <option>NOM DE RESPONSABLE</option>
                        <option>STATUT</option>
                        <option>DATE</option>
                      </select><br /><br />
                      <Input type='text' sx={{ border: "1px solid black", width: "300px" }} placeholder="Veuillez saisir l'etat ou le nom"></Input>
                      <br /> ou <br />
                      <Input type='date' sx={{ border: "1px solid black", width: "300px" }} placeholder="Veuillez saisir l'etat ou le nom"></Input>
                      <br /><br />
                      TYPE DE FICHIER :
                      <select className="col-md-5">
                        <option>PDF</option>
                        <option>CSV</option>

                      </select><br /><br />
                      <Button onClick={handleB2} sx={{ backgroundColor: 'grey', color: "white" }}>Annuler</Button>
                      <Button sx={{ backgroundColor: 'blue', color: "white", marginLeft: "10px" }}>Imprimer</Button>
                    </Box>
                  </Modal>

                  {/* liste des obligations  */}
                  <Typography variant="h5" component="h3">
                    Listes des Obligations
                  </Typography>
                  <TableContainer component={Paper} variant="outlined" square bgcolor={"white"} sx={{ backgroundColor: 'white', colorScheme: 'white', marginBottom: "40px" }} >
                    <Table sx={{ minWidth: 320 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Id</TableCell>
                          <TableCell align="center">Titre</TableCell>
                          <TableCell align="center">Description</TableCell>
                          <TableCell align="center">Date Creation</TableCell>
                          <TableCell align="center">Date Echeance</TableCell>
                          <TableCell align="center">Date Mise a Jour</TableCell>
                          <TableCell align="center">Entite</TableCell>
                          <TableCell align="center">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((data) => (
                          <TableRow
                            key={data.id_obligation}
                            sx={{}}
                          >
                            <TableCell align="center">{data.id_obligation}</TableCell>
                            <TableCell align="center">{data.titre}</TableCell>
                            <TableCell align="center">{data.description}</TableCell>
                            <TableCell align="center">{data.date_creation}</TableCell>
                            <TableCell align="center">{data.date_echeance}</TableCell>
                            <TableCell align="center">{data.date_maj}</TableCell>
                            <TableCell align="center">{data.id_entite}</TableCell>
                            <TableCell align="center">
                              <Box display={'flex'} alignContent={'space-between'} justifyContent={'space-between'} fontSize={"20"}>
                                <i
                                  class="fas fa-edit mr-2 " role="button"
                                  onClick={() => {
                                    setCreateOrUpdate(false);
                                    setIdObligation(data.id_obligation);
                                    setField(data.titre, data.description, data.date_echeance, data.date_creation, data.date_maj, data.id_entite);
                                    handleOpen();
                                  }}
                                ></i>
                                <i class="fas fa-comment"></i>
                                <i
                                  class="fas fa-trash-alt " role="button"
                                  onClick={() => { deleteObligation(data.id_obligation) }}
                                ></i>
                                <i class="fas fa-eye" role="button"></i>
                                <i class="fas fa-file-export" role="button" onClick={() => handleB()}></i>
                              </Box>
                            </TableCell>

                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {/* <{children}/> */}
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography variant="h5" component="h3">
                      Listes des Taches
                    </Typography>
                    <Button onClick={handleOpen} sx={{ bgcolor: 'blue', colorScheme: 'blue', color: "white", marginLeft: "20px" }} >CREER TACHE</Button>
                  </Box>

                  <TableContainer component={Paper} variant="outlined" square bgcolor={"white"} sx={{ backgroundColor: 'white', colorScheme: 'white' }} >
                    <Table sx={{ minWidth: 320 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Intitulé</TableCell>
                          <TableCell align="right">Debut</TableCell>
                          <TableCell align="right">Fin</TableCell>
                          <TableCell align="right">Obligation</TableCell>
                          <TableCell align="right">Achevement</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row) => (
                          <TableRow
                            key={row.name}
                            sx={{

                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.surname}</TableCell>
                            <TableCell align="right">{row.number}</TableCell>
                            <TableCell align="right">{row.email}</TableCell>
                            <TableCell align="right">{row.role}</TableCell>
                            <TableCell align="left"  >
                              <Box display={'flex'} justifyContent={'space-evenly'} fontSize={"20"} >
                                <i class="fas fa-edit mr-2 " role="button" ></i>

                                <i class="fas fa-trash-alt " role="button"></i>


                              </Box>



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
      </Provider >
    </>
  );
}
