using System;
using System.Collections.Generic;
using System.Linq;
using Citolab.Persistence;

namespace Diggel.Logic.Models
{
    public class TestSession : Model, IComparable<TestSession>
    {
       public string Context { get; set; }
        public int? TestModuleId { get; set; }
        public Guid CandidateSessionsId;
        public Guid GroupId;
        public string GroupName;
        public DateTime StartTimestamp;
        public string StartCode { get; set; }
        public TestStatus Status;
        public List<SessionLogRow> Log;

        public TestSession()
        {
            Log = new List<SessionLogRow>();
        }

        /// <summary>
        /// Start the session, or resume it when it's already started.
        /// </summary>
        public void Start()
        {
            switch (Status)
            {
                case TestStatus.NotStarted:
                    Status = TestStatus.Started;
                    StartTimestamp = DateTime.UtcNow;
                    Log.Add(new SessionLogRow
                    {
                        Timestamp = StartTimestamp,
                        Action = LogActions.SessionStarted,
                        Content = string.Empty
                    });
                    break;
                case TestStatus.Started:
                case TestStatus.Resumed:
                    Status = TestStatus.Resumed;
                    Log.Add(new SessionLogRow
                    {
                        Timestamp = DateTime.UtcNow,
                        Action = LogActions.SessionResumed,
                        Content = string.Empty
                    });
                    break;
            }
        }

        public void Finish()
        {
            Status = TestStatus.Finished;
            Log.Add(new SessionLogRow
            {
                Timestamp = DateTime.UtcNow,
                Action = LogActions.SessionFinished,
                Content = string.Empty
            });
        }

        public DateTime? GetSessionStartTimestamp()
        {
            return Log.FirstOrDefault(l => l.Action == LogActions.SessionStarted)?.Timestamp;
        }

        public int CompareTo(TestSession other)
        {
            if (ReferenceEquals(this, other)) return 0;
            if (ReferenceEquals(null, other)) return 1;
            var groupNameComparison = string.Compare(GroupName, other.GroupName, StringComparison.Ordinal);
            if (groupNameComparison != 0) return groupNameComparison;
            var statusComparison = Status.CompareTo(other.Status);
            if (statusComparison != 0) return statusComparison;
            return StartTimestamp.CompareTo(other.StartTimestamp);
        }
    }
}