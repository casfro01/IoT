using System.ComponentModel.DataAnnotations;

namespace service.Models.Request;

public record RegisterRequest(
    [Required] string Email,
    [Required] string UserName,
    [MinLength(6)] string Password,
    [Required] string Name
);

public record LoginRequest([Required] string Email, [Required] string Password);