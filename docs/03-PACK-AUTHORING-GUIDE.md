# 3. Pack authoring guide

## 3.1 Pack types
| Type | Purpose | Required slots |
|---|---|---|
| target | How to build on a stack (Node.js/Lambda, Spring Boot/OpenShift, .NET 8/AKS, React SPA) | 8 `stack-*` slots |
| source | How to read and preserve a legacy stack (Java EE, .NET Framework/IIS, COBOL, PowerBuilder) | `legacy-analysis`, `legacy-to-target-mapping`, `semantic-parity` |
| domain | Business knowledge (billing, accounts receivable, outage management) | `domain-knowledge` |

## 3.2 Build a pack
```
/sdd-core:sdd-new-pack pack-dotnet8-aks target
```
or copy `plugins/pack-template`. Then:
```bat
node plugins\sdd-core\scripts\check-pack-contract.js --pack plugins\pack-dotnet8-aks
```

## 3.3 Writing a good slot skill
- **Description is the trigger.** Say exactly when to load it ("Load when designing or implementing Oracle data access from .NET").
- **Short SKILL.md, deep references.** Keep SKILL.md to the rules and checklist; put long guides in `references/`.
- **Mandatory vs. preferred.** Label each rule. Checkers fail on mandatory rules only.
- **Approved libraries with versions.** Implementers may not introduce others without a dependency approval.
- **Review checklist.** Code-checker and architecture-checker use it verbatim.
- **Examples.** One correct and one incorrect snippet per critical pattern.

## 3.4 Rules for packs
1. Packs may be stricter than enterprise standards, never weaker.
2. Packs may not ship hooks that change or disable `sdd-core` hooks.
3. Packs may add agents only with a `<pack>-` name prefix and only as helpers, not as gate checkers.
4. Packs declare `compatible_core` and follow semantic versioning.
5. Every pack has an owner email and a review cadence (at least quarterly).

## 3.5 Pack catalog to build next (suggested)
| Pack | Type | Why first |
|---|---|---|
| pack-dotnet-framework-legacy | source | Many .NET Framework / IIS apps in the portfolio |
| pack-dotnet8-target | target | Natural target for .NET modernizations |
| pack-spring-boot-openshift | target | Container platform option under evaluation |
| pack-react-spa | target | UI slices for any modernization |
| pack-domain-<business-area> | domain | Shared glossary and rules across apps in one business area |
