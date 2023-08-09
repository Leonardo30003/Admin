<?php
include('isLogin.php');
session_destroy();
header('Location: ../../');
