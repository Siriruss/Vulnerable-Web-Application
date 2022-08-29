$(document).ready(function () {

  $('#submit-button').click(function () {
    let searchQuery = $('#input-field').val()
    $('#searchResults').html(searchQuery)

  })

  $('#addImage-button').click(function () {
    let imageURL = $('#newImageURL').val()
    let img = document.createElement('img')
    img.src = imageURL

    $('#addedImageDiv').prepend(img)
  })

})

// function randomTool() {
//   selectedTool = 'CredKing'
//   document.getElementById('toolGenerator').value = ('http://localhost:4000/tools')
// }

function check() {
  document.getElementById('entranceConfirmation').innerHTML = ('Thank you for entering the drawing ' + document.xsschallenge2form.entrantName.value)
}
