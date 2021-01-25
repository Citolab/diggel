using System;
using System.Collections.Generic;
using Diggel.Logic.Models;

namespace Diggel.Logic.Seeding
{
    public class SeedGroups
    {
        public static List<Group> GetGroups()
        {
            var groups = new List<Group>
            {
                new Group
                {
                    Id = Guid.Parse("0782E94F-77FD-429E-A735-39F43EDE7234"),
                    Name = "Groep Bonnefooi"
                },
                new Group
                {
                    Id = Guid.Parse("67C9C1EC-A9D9-4883-BFA2-6E79D72A523D"),
                    Name = "Groep We Zien Wel"
                },
                new Group
                {
                    Id = Guid.Parse("6DE1C45F-783A-418F-8673-9D3CEE6743BA"),
                    Name = "Groep 't Word Wat"
                },
                new Group
                {
                    Id = Guid.Parse("4AB9D434-10CB-4BBD-8394-DE15D791CC26"),
                    Name = "Citolab"
                }
            };
            return groups;
        }

        public static List<Group> GetDemoGroups()
        {
            var groups = new List<Group>
            {
                new Group
                {
                    Id = Guid.Parse("EF6ABBF4-01B6-42F7-A567-B32C4B5CAE31"),
                    Name = "Demogroep",
                    IsDemoGroup = true
                }
            };
            return groups;
        }
    }
}