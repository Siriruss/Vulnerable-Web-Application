//Custom scripts that are used in the XSS challenges

$(document).ready(function () {

  $('#submit-button').click(function () {
    let searchQuery = $('#input-field').val()
    $('#searchResults').html(searchQuery)

  })

})

function check() {
  document.getElementById('entranceConfirmation').innerHTML = ('Thank you for entering the drawing ' + document.xsschallenge2form.entrantName.value)
}
