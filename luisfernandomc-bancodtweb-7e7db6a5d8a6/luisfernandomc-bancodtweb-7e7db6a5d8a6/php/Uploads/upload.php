<?php

extract($_GET);
extract($_POST);
$target_file = $ruta . basename($_FILES['photo']['name']);
if ($_FILES["photo"]["tmp_name"] !== '') {
    if (!getimagesize($_FILES["photo"]["tmp_name"])) {
        echo "{failure: true, message: 'El Archivo no es una Imagen'}";
    } else {
        $typeImg = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
        if ($typeImg == 'jpg' || $typeImg == 'jpeg' || $typeImg == 'png' || $typeImg == 'gif') {
            //La imagen es mayor de 5mb ?
            if ($_FILES["photo"]["size"] > 5242880) {
                echo "{failure: true, message: 'La Imagen excede el Tamaño ( Max: 5MB )'}";
            } else {
                if (strlen($_FILES['photo']['tmp_name']) > 100) {
                    echo "{failure: true, message: 'El nombre del archivo es muy largo ( Max: 100 caracteres)'}";
                } else {
                    if ($typeImg == 'jpg' || $typeImg == 'jpeg' || $typeImg == 'png') {
                        $target_file = $ruta . basename($nombre . '.png');
                    } else {
                        $target_file = $ruta . basename($nombre . '.' . $typeImg);
                    }
                    if (move_uploaded_file($_FILES['photo']['tmp_name'], $target_file)) {
                        if ($typeImg == 'jpg' || $typeImg == 'jpeg' || $typeImg == 'png') {
                            echo "{success: true, message: '" . basename($nombre . '.png') . "'}";
                        } else {
                            echo "{success: true, message: '" . basename($nombre . '.' . $typeImg) . "'}";
                        }
                    } else {
                        echo "{success: false, message: 'No se pudo subir la Imagen, problemas con el archivo. Intente con otra imagen.'}";
                    }
                }
            }
        } else {
            echo "{success: false, message: 'El Archivo no es un Formato de Imagen Valido ( JPG, JPEG, PNG).'}";
        }
    }
} else {
    echo "{success: false, message: 'MUCHA ATENCIÓN NO HA SUBIDO UNA IMAGEN'}";
}
