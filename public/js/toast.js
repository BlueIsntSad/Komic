window.onload = function () {
  $("#toast-message").toast({ autohide: true });
};

function showToast(type, title, message) {
  $("#toast-message").removeClass("success info warning error");
  $("#toast-message .toast-header").removeClass("success info warning error");
  $("#toast-message .toast-header").addClass(`${type}`);
  $("#toast-message").addClass(`${type}`);
  $("#toast-message .title").text(title);
  $("#toast-message .message").text(message);
  $("#toast-message").toast({ autohide: true });
  $("#toast-message").toast("show");
}
