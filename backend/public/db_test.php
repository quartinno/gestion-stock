<?php

$host = '127.0.0.1';
$db   = 'stock';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    // Connect to the MySQL server, but not a specific database
    $pdo = new PDO("mysql:host=$host;charset=$charset", $user, $pass, $options);
    $pdo->exec("DROP DATABASE IF EXISTS `$db`;");
    $pdo->exec("CREATE DATABASE `$db`;");
    echo "Database '$db' dropped and recreated successfully!";
} catch (\PDOException $e) {
    die("DB ERROR: " . $e->getMessage());
}
