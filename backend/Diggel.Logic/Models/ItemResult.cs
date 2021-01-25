using System;
using System.Collections.Generic;
using Citolab.Persistence;
using Citolab.Persistence.Helpers;

namespace Diggel.Logic.Models
{
    public class ItemResult : Model, IComparable<ItemResult>
    {
        [EnsureIndex]
        public Guid TestSessionId { get; set; }
        public string ItemContext { get; set; }
        public string Identifier { get; set; }
        public List<OutcomeVariable> OutcomeVariables { get; set; }
        public List<ResponseVariable> ResponseVariables { get; set; }
        public int CompareTo(ItemResult other)
        {
            if (ReferenceEquals(this, other)) return 0;
            if (ReferenceEquals(null, other)) return 1;
            return DateTime.Compare(LastModified, other.LastModified);
        }
    }
}