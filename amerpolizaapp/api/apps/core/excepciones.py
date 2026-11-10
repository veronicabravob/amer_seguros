"""Excepciones de negocio del proyecto.

La lógica de `services.py` lanza estas excepciones; `config.errores` las traduce a la
respuesta HTTP correspondiente. Los endpoints no arman respuestas de error a mano.
"""


class ReglaDeNegocio(Exception):
    """Una regla del dominio impide completar la operación.

    Se traduce a `409 {codigo, mensaje, campo}` salvo que la subclase indique otro estado.
    """

    estado = 409

    def __init__(self, codigo: str, mensaje: str, campo: str | None = None):
        self.codigo = codigo
        self.mensaje = mensaje
        self.campo = campo
        super().__init__(mensaje)

    def como_dict(self) -> dict:
        return {"codigo": self.codigo, "mensaje": self.mensaje, "campo": self.campo}


class NoAutenticado(ReglaDeNegocio):
    """Falta la sesión o el token no es válido (RN-4)."""

    estado = 401


class AccesoNegado(ReglaDeNegocio):
    """Hay sesión, pero la cuenta no puede entrar."""

    estado = 403


class DemasiadosIntentos(ReglaDeNegocio):
    """Bloqueo temporal por intentos fallidos (RN-2)."""

    estado = 429
