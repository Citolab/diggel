using System;
using Diggel.Logic.Models;
using Microsoft.Extensions.Primitives;

namespace Diggel.Logic.ViewModels
{
    public class SessionLogRowViewModel : IComparable<SessionLogRowViewModel>
    {
        public DateTime Timestamp { get; set; }
        public string Action { get; set; }
        public string Content { get; set; }
        public string ItemId { get; set; }
        public string ItemContext { get; set; }
        public string GroupName { get; set; }
        public Guid TestSessionId { get; }
        public int SequenceNumber { get; set; }

        public int CompareTo(SessionLogRowViewModel other)
        {
            if (ReferenceEquals(this, other)) return 0;
            if (ReferenceEquals(null, other)) return 1;
            return Timestamp.CompareTo(other.Timestamp);
        }

        public SessionLogRowViewModel(SessionLogRow logRow, string itemId, string itemContext, string groupName, Guid testSessionId)
        {
            Timestamp = logRow.Timestamp;
            Action = logRow.Action;
            Content = logRow.Content;
            ItemId = itemId;
            ItemContext = itemContext;
            GroupName = groupName;
            TestSessionId = testSessionId;
        }
        
        public SessionLogRowViewModel(ItemLogRow logRow, string itemId, string groupName, Guid testSessionId)
        {
            Timestamp = logRow.Timestamp;
            Action = logRow.Action;
            Content = logRow.Content;
            ItemId = itemId;
            ItemContext = logRow.ItemContext;
            GroupName = groupName;
            TestSessionId = testSessionId;
        }
    }
}