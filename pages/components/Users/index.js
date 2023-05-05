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
import { Alert, Box, Button, Input, Modal, Select } from "@mui/material";
import axios from "axios";
import { update } from "lodash";
// import TransitionAlerts from "./Alerte";

export default function UsersIn() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  const [err, setErr] = useState("");
  const [success, setSuces] = useState("");


  // recuperation de la liste des utilisateurs 
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:4000/api/user', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {
        // on recupère la liste des utilisateur dans data 
        setData(response.data.data);
        setErr('');
        setSuces(response.data.data);
      })
      .catch((error) => {
        // Si la connexion a échoué, affichez un message d'erreur en console
        setErr(error.response.data.message)
      });
  }, [data])

  //recuperer la liste des roles
  const [roleData, setRoleData] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:4000/api/role', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {
        // on recupère la liste des role dans entiteData 
        setRoleData(response.data.data);
        setErr('');
        setSuces(response.data.data);
      })
      .catch((error) => {
        // Si la connexion a échoué, affichez un message d'erreur en console
        setErr(error.response.data.message)
      });
  }, [roleData])

  //recuperer la liste des entités 
  const [entiteData, setEntiteData] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:4000/api/entite', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {
        // on recupère la liste des role dans entiteData 
        setEntiteData(response.data.data);
        setErr('');
        setSuces(response.data.data);
      })
      .catch((error) => {
        // Si la connexion a échoué, affichez un message d'erreur en console
        setErr(error.response.data.message)
      });
  }, [entiteData])

  // recuperer le role par son id pour afficher le label 
  const [role, setRole] = useState([]);
  const foundRoleById = (role_id) => {
    axios.get(`http://localhost:4000/api/role/${role_id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {
        setRole(response.data.data)
      })
      .catch((error) => {

      });
    return role.label;
  }

  // recuperer l'entite par son id pour afficher le label 
  const [entite, setEntite] = useState([]);
  const foundEntiteById = (id_entite) => {
    axios.get(`http://localhost:4000/api/entite/${id_entite}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {
        setEntite(response.data.data)
      })
      .catch((error) => {

      });
    return entite.nom;
  }


  // supprimer un user 
  function deleteUser(id) {
    console.log('bjr');
    axios.delete(`http://localhost:4000/api/user/${JSON.stringify(id)}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {
        console.log(response.data.message);
        setErr('');
        setSuces(response.data.data);
      })
      .catch((error) => {
        // Si la connexion a échoué, affichez un message d'erreur en console 
        setErr(error.response.data.message);
      });
  }


  //reçois les données saisies pour la creation ou la modification d'un utilisateur 
  const [newUser, setNewUser] = useState({
    "nom": "",
    "email": "",
    "mot_de_passe": "",
    "id_entite": 1,
    "role_id": null,
  });

  const { nom, email, mot_de_passe, id_entite, role_id } = newUser;
  const changeHandler = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value })
  }

  //variable pour savoir si le bouton valider lance la modif ou la création update ou enregirstrer
  const [createOrUpdate, setCreateOrUpdate] = useState(null);


  const creatUser = (e) => {
    axios.post('http://localhost:4000/api/user', JSON.stringify(newUser), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {
        // Si la connexion est réussie, redirigez l'utilisateur vers la page de dashboard
        console.log(response.data.message);

        // vider les champs un fois la requette est reussie
        setNewUser({
          "nom": "",
          "email": "",
          "mot_de_passe": "",
          "id_entite": 1,
          "role_id": 1
        });
        handleClose();
        console.log(response.data.data);
      })
      .catch((error) => {
        // Si la connexion a échoué, affichez un message d'erreur à l'utilisateur
        console.log(error.response.data.data);
        setErr(error.response.data.message)
      });
  }

  // contient l'id du user qui sera modif 
  const [idUser, setIdUser] = useState(null);

  // update utilisateur
  const updateUser = () => {
    axios.put(`http://localhost:4000/api/user/${JSON.stringify(idUser)}`, JSON.stringify(newUser), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {
        // Si la connexion est réussie, redirigez l'utilisateur vers la page de dashboard
        console.log(response.data.message);
        setSuces(response.data.data);
        handleClose();
        // vider les champs un fois la requette est reussie
        setNewUser({
          "nom": "",
          "email": "",
          "mot_de_passe": "",
          "id_entite": 1,
          "role_id": null
        });
      })
      .catch((error) => {
        // Si la connexion a échoué, affichez un message d'erreur à l'utilisateur
        console.log(error.response.data.message)
        handleClose()
        setNewUser({
          "nom": "",
          "email": "",
          "mot_de_passe": "",
          "id_entite": 1,
          "role_id": null
        });
      });
  }

  // determine la fonction qui sera lance en fonction de la var createOrUpdate
  const delUpd = (e) => {
    if (createOrUpdate) {
      creatUser();
    } else {
      updateUser(e);
    }
  }

  //remplis les champs avec les données de l'utilisteur avan d'ouvrir le modale
  const setField = (nom, email, id_entite, role_id) => {
    setNewUser({
      "nom": nom,
      "email": email,
      "mot_de_passe": '',
      "id_entite": id_entite,
      "role_id": role_id
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
                  {/* ouverture de la capsule  */}
                  <Button
                    onClick={() => {
                      setCreateOrUpdate(true);
                      handleOpen();
                    }}
                    className="float-md-right col-md-4"
                  >CREER UTILISATEUR</Button>

                  {/* campsule pour la creation des utilisateur  */}
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                    sx={{ marginLeft: '30%' }}
                  >
                    <Box width={450} bgcolor={"white"} mt={10} pl={2} pt={2} boxShadow={10}>
                      <Input
                        type="text" name="nom" placeholder="Nom"
                        value={nom} onChange={changeHandler} required
                        sx={{ marginBottom: 1, marginRight: 5 }}
                      />
                      <Input
                        type="email" name="email" placeholder="email"
                        value={email} onChange={changeHandler}
                      /><br /><br />
                      {/* <Input
                        type="number" name="id_entite" placeholder="id entite"
                        value={id_entite} onChange={changeHandler}
                      /> */}
                      {/* <Input
                        type="number" name="role_id" placeholder="id role"
                        value={role_id} onChange={changeHandler}
                        sx={{ marginBottom: 1, marginRight: 5 }}
                      /> */}

                      <select value={role_id} onChange={changeHandler} name="role_id">
                        <option value="">Selectioner un role</option>
                        {roleData.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <select value={id_entite} onChange={changeHandler} name="id_entite">
                        <option value="">Selectioner une entité</option>
                        {entiteData.map((entite) => (
                          <option key={entite.id_entite} value={entite.id_entite}>
                            {entite.nom}
                          </option>
                        ))}
                      </select> <br /><br />

                      <Input
                        type="Password" name="mot_de_passe" placeholder="Mot de passe"
                        value={mot_de_passe} onChange={changeHandler}
                        sx={{ marginBottom: 1, marginRight: 5 }}
                      />
                      <Button onClick={handleClose} sx={{ color: 'gray' }}>fermer</Button>
                      <Button
                        color="primary" variant="contained"
                        onClick={() => {
                          delUpd()
                        }}
                      >Valider</Button>
                    </Box>
                  </Modal>
                  {/* {success ? <Alert severity="success">{success}</Alert> : <></>} */}
                  {/* le tableau des utilisateur  */}
                  <TableContainer variant="outlined" component={Paper} bgcolor={"white"} >
                    <Table sx={{ minWidth: 320 }} aria-label="simple table">
                      {/* les entetes de colones  */}
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Id</TableCell>
                          <TableCell align="center">Nom</TableCell>
                          <TableCell align="center">Email</TableCell>
                          {/* <TableCell align="right">MDP</TableCell> */}
                          <TableCell align="center">Role</TableCell>
                          <TableCell align="center">Entite</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      {/* le corps du tableau  */}
                      <TableBody>
                        {/* map de ligne  */}
                        {data.map((user) => (
                          <TableRow
                            key={user.id_utilisateur}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            {/* l'id de l'utilisateur  */}
                            <TableCell align="center">{user.id_utilisateur}</TableCell>
                            {/* le nom de l'utilisateur  */}
                            <TableCell align="center">{user.nom}</TableCell>
                            {/* l'email de l'utilisateur  */}
                            <TableCell align="center">{user.email}</TableCell>
                            {/* le mdp de l'utilisateur  */}
                            {/* <TableCell align="right">{user.mot_de_passe}</TableCell> */}
                            {/* l'id de l'entite  */}
                            <TableCell align="center">{() => { foundRoleById(user.role_id) }}</TableCell>
                            {/* l'id du role de l'utilisateur */}
                            <TableCell align="center">{() => { foundEntiteById(user.id_entite) }}</TableCell>
                            {/* la colone des actions  */}
                            <TableCell align="center"  >
                              <i
                                className="fas fa-edit mr-2 " role="button"
                                onClick={() => {
                                  setIdUser(user.id_utilisateur);
                                  setField(user.nom, user.email, user.id_entite, user.role_id);
                                  setCreateOrUpdate(false);
                                  handleOpen();
                                }}
                              ></i>
                              <i className="fas fa-trash-alt " role="button" onClick={() => { deleteUser(user.id_utilisateur) }} ></i>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {/* fin tableau  */}
                  {err ? <Alert severity="error">{err}</Alert> : <></>}
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
