namespace service.Models;

public record AlertPayload(
    string? Message,
    int Severity);
