import toastr from 'toastr'

toastr.options = {
  "closeButton": true,
  "debug": true,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "6000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

export function mostrarToast(titulo, mensagem, tipo) {
  toastr[tipo](mensagem, titulo)
}

export function mensagemErro(mensagem) {
  mostrarToast('Erro', mensagem, 'error')
}

export function mensagemSucesso(mensagem) {
  mostrarToast('Sucesso', mensagem, 'success')
}

export function mensagemAlerta(mensagem) {
  mostrarToast('Alerta', mensagem, 'warning')
}

