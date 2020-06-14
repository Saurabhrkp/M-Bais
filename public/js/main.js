$(document).on('click', '[data-toggle="lightbox"]', function (event) {
  event.preventDefault();
  $(this).ekkoLightbox();
});

$(document).ready(function () {
  $('#profileForm :input').prop('disabled', true);
  $('#editProfile').prop('disabled', false);
  $('#deletebutton').prop('disabled', false);
  $('#submitProfile').hide();
  $('#avatar').hide();
  $('#editProfile').click(function () {
    if (this.value == 'Edit Profile') {
      this.value = 'Cancel';
      $('#profileForm :input').prop('disabled', false);
      $('#editProfile').prop('disabled', false);
      $('#deletebutton').prop('disabled', false);
      $('#submitProfile').show();
      $('#avatar').show();
    } else {
      this.value = 'Edit Profile';
      $('#profileForm :input').prop('disabled', true);
      $('#editProfile').prop('disabled', false);
      $('#deletebutton').prop('disabled', false);
      $('#submitProfile').hide();
      $('#avatar').hide();
    }
  });
});

$('#video').change(function (e) {
  if (e.target.files.length) {
    $(this).next('.custom-file-label').html(e.target.files[0].name);
  } else {
    $(this).next('.custom-file-label').html('Choose Video');
  }
});

$('#thumbnail').change(function (e) {
  if (e.target.files.length) {
    $(this).next('.custom-file-label').html(e.target.files[0].name);
  } else {
    $(this).next('.custom-file-label').html('Choose Thumbnail');
  }
});

$('#photos').change(function (e) {
  if (e.target.files.length > 6) {
    alert('You can select only 6 Photos');
    $(this).next('.custom-file-label').html('Choose Photos');
    $(this).val('');
  } else if (e.target.files.length > 0 && e.target.files.length < 6) {
    let file_name = [];
    for (const key in e.target.files) {
      if (e.target.files.hasOwnProperty(key)) {
        const element = e.target.files[key];
        file_name.push(element.name);
      }
    }
    const files = file_name.join(', ');
    $(this).next('.custom-file-label').html(files);
  } else {
    $(this).next('.custom-file-label').html('Choose Photos');
  }
});
