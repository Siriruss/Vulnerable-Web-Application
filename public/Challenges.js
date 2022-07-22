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
