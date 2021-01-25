using System;
using System.Collections.Generic;
using System.Text;

namespace Diggel.Logic.Models
{
    public class CandidateResponse
    {
        public string Value { get; set; }
        /// <summary>
        /// This is not QTI but is used to restore the state of the interaction
        /// Some items are difficult to restore from a readable response.
        /// </summary>
        public string InteractionState { get; set; }
    }
}
