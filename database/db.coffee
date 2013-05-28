get = (url) ->
  xhr = new XMLHttpRequest
  xhr.onreadystatechange = -> 
    if xhr.readyState == 4 && xhr.status == 200
      console.log JSON.parse xhr.responseText
  xhr.open 'GET', url, true
  xhr.setRequestHeader 'X-Requested-With', 'XMLHttpRequest'
  do xhr.send
  
get "db.php?q=moves"
get "db.php?q=characters"
get "db.php?q=episodes"