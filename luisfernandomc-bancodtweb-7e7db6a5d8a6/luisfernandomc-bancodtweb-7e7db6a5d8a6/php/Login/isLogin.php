<?php
session_start();
// Comprobar si esta logueado
if (!$_SESSION["IS_SESSION_BANCODT"]) {
    header("Location: index.php");
    return;
}