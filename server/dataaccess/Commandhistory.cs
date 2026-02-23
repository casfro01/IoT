using System;
using System.Collections.Generic;

namespace dataaccess;

public partial class Commandhistory
{
    public string Id { get; set; } = null!;

    public DateTime Timeexecuted { get; set; }

    public int Action { get; set; }

    public string? Value { get; set; }
}
