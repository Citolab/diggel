using System;
using System.Linq;
using System.Security.Claims;
using Diggel.Logic.Models;

namespace Diggel.Backend.Helpers
{
    public static class ClaimsPrincipalExtensions
    {
        /// <summary>
        /// Get the <see cref="Guid"/> of the started test session <see cref="TestSession"/> from the <see cref="ClaimTypes.NameIdentifier"/> <see cref="Claim"/>.
        /// </summary>
        /// <param name="claimsPrincipal">The logged in user/testsession.</param>
        /// <returns>The guid of the test session if the claim exists, otherwise <see cref="Guid.Empty"/></returns>
        public static Guid GetTestSessionId(this ClaimsPrincipal claimsPrincipal)
        {
            var idClaim = claimsPrincipal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (idClaim != null)
            {
                var idString = idClaim.Value;
                if (Guid.TryParse(idString, out Guid id))
                {
                    return id;
                }
            }

            return Guid.Empty;
        }

        public static UserRole GetUserRole(this ClaimsPrincipal claimsPrincipal)
        {
            var roleClaim = claimsPrincipal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
            if (roleClaim != null)
            {
                var roleString = roleClaim.Value;
                if (Enum.TryParse(roleString, out UserRole userRole))
                {
                    return userRole;
                }
            }

            return UserRole.Candidate;
        }
    }
}