using System;
using System.Collections.Generic;

namespace Diggel.Logic.Models
{
    public class SessionLogRow
    {
        public DateTime Timestamp { get; set; }
        public string Action { get; set; }
        public string Content { get; set; }
    }
}