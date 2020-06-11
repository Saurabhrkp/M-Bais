$(document).on('click', '[data-toggle="lightbox"]', function (event) {
  event.preventDefault();
  $(this).ekkoLightbox();
});

$(document).ready(function () {
  $('#profileForm :input').prop('disabled', true);
  $('#editProfile').prop('disabled', false);
  $('#submitProfile').hide();
  $('#editProfile').click(function () {
    if (this.value == 'Edit Profile') {
      this.value = 'Cancel';
      $('#profileForm :input').prop('disabled', false);
      $('#editProfile').prop('disabled', false);
      $('#submitProfile').show();
    } else {
      this.value = 'Edit Profile';
      $('#profileForm :input').prop('disabled', true);
      $('#editProfile').prop('disabled', false);
      $('#submitProfile').hide();
    }
  });
});
