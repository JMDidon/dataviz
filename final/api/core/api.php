<?php
# Get JSON data
  function get() {
    // header('Content-Type: application/json');
    if (!in_array(path('sheet'), array_keys(sheets::getAll()))) exit(false);
    echo json_encode(sheets::load(path('sheet')));
  }


# Update data from Google
  function update() {
    if (sha1(param('pass')) != pass) go(root());
    array_map('sheets::save', array_keys(sheets::getAll()));
    go(root());
  }
