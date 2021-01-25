using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using Citolab.Persistence;
using MongoDB.Bson.Serialization.IdGenerators;

namespace Diggel.Logic.Models
{
    public class Group : Model
    {
        public string Name { get; set; }
        public bool IsDemoGroup { get; set; }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="numberOfStartCodes">Number of start codes to generate.</param>
        /// <param name="length">Number of characters per start code.</param>
        /// <param name="existingStartCodes"></param>
        /// <returns></returns>
        public static List<string> GenerateStartCodes(int numberOfStartCodes, int length,
            List<string> existingStartCodes)
        {
            if (length > 8)
            {
                throw new ArgumentException("Maximum start code length is 8", nameof(length));
            }

            var result = new List<string>();
            for (int i = 0; i < numberOfStartCodes; i++)
            {
                string newStartCode;
                do
                {
                    newStartCode = Path.GetRandomFileName().Replace(".", "")
                        .Substring(0, length)
                        .ToUpperInvariant();
                } while (result.Contains(newStartCode) && existingStartCodes.Contains(newStartCode));

                result.Add(newStartCode);
            }

            return result;
        }
    }
}