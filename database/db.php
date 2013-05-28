<?php
function csvToArray($file, $delimiter = ',') {
  if (($handle = fopen($file, 'r')) !== FALSE) { 
    $i = 0; 
    while (($lineArr = fgetcsv($handle, 4000, $delimiter, '"')) !== FALSE) {
      if ($i == 0) $keys = $lineArr;
      else $arr[] = array_combine($keys, (array)$lineArr);
      $i++; 
    } 
    fclose($handle);
  }
  return (array)$arr;
}

$files = array(
  'moves'       => 'https://docs.google.com/spreadsheet/pub?key=0AqZKrXZuLhp-dDdvakpiejdSY1pHVFkyZ2FydVpmTkE&single=true&gid=0&output=csv',
  'characters'  => 'https://docs.google.com/spreadsheet/pub?key=0AqZKrXZuLhp-dDdvakpiejdSY1pHVFkyZ2FydVpmTkE&single=true&gid=4&output=csv',
  'episodes'    => 'https://docs.google.com/spreadsheet/pub?key=0AqZKrXZuLhp-dDdvakpiejdSY1pHVFkyZ2FydVpmTkE&single=true&gid=5&output=csv'
);
  
if (!in_array($_GET['q'], array_keys($files))) exit(false);
echo json_encode(csvToArray($files[$_GET['q']]));
