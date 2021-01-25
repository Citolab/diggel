using Citolab.Persistence;
using System;
using System.Collections.Generic;
using System.Text;

namespace Diggel.Logic.Models
{
    public class CandidateSessions: Model
    {
        public string StartCode { get; set; }
        public bool IsDemo { get; set; } = false;
        public TestStatus Status { get; set; }
        public int? TestModuleId { get; set; }
        public Guid GroupId;
        public string GroupName;
        public DateTime StartTimestamp { get; set; }
        public List<Guid> TestSessions { get; set; } = new List<Guid>();
    }
}
