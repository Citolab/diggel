using System;
using Citolab.Persistence;
using Citolab.Persistence.Helpers;

namespace Diggel.Logic.Models
{
    public class ItemLogRow : Model
    {
        [EnsureIndex] public Guid TestSessionId;
        [EnsureIndex] public string ItemId;
        public string ItemContext;
        public DateTime Timestamp;
        [EnsureIndex] public string Action;
        public string Content;
    }
}