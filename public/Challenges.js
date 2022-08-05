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

function check() {
  document.getElementById('entranceConfirmation').innerHTML = ('Thank you for entering the drawing ' + document.xsschallenge2form.entrantName.value)
}

function combine() {
  let firstName = document.xsschallenge3form.entrantFirstName.value
  let lastName = document.xsschallenge3form.entrantLastName.value
  document.getElementById('combinedComfirmation').innerHTML = ('Thank you for entering the drawing ' + firstName + ' ' + lastName)
  document
}
