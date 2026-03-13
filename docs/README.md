# Project Document Index

## Toyota Emergency Response Platform - Documentation Overview

**Last Updated:** 2026-03-13
**Project:** Unified Emergency Response Platform (Philippines)

---

## Document Hierarchy

```
toyota-mobility-for-emergency/
└── docs/
    ├── README.md                           ← You are here
    ├── product-brief-emergency-response-platform.md    ← Main Product Brief
    ├── personas-detailed.md                             ← User Personas
    ├── user-journey-maps.md                            ← User Journey Maps
    ├── feature-specs/
    │   ├── template-feature-spec.md                   ← Feature Spec Template
    │   ├── silent-sos-spec.md                         ← Silent SOS Feature
    │   ├── sms-ussd-fallback-spec.md                 ← SMS/USSD Fallback
    │   └── multi-agency-escalation-spec.md           ← Multi-Agency Escalation
    ├── prototype-prompts/
    │   ├── responder-mobile-app-prompt.md            ← Responder App Spec
    │   └── dispatcher-dashboard-prompt.md            ← Dispatcher Dashboard Spec
    └── research/
        └── emergency-services-philippines.md          ← Market Research
```

---

## Document Descriptions

### Core Documents

| Document | Purpose | Audience |
|----------|---------|----------|
| [product-brief-emergency-response-platform.md](product-brief-emergency-response-platform.md) | Main product brief - defines the product vision, features, and roadmap | All stakeholders |
| [personas-detailed.md](personas-detailed.md) | Detailed user personas covering 14 different user types | Design, Product, Engineering |
| [user-journey-maps.md](user-journey-maps.md) | Visual journey maps for key user scenarios | Design, Product |

### Feature Specifications

| Document | Purpose | Status |
|----------|---------|--------|
| [feature-specs/silent-sos-spec.md](feature-specs/silent-sos-spec.md) | Detailed specification for Silent SOS feature | Draft |
| [feature-specs/sms-ussd-fallback-spec.md](feature-specs/sms-ussd-fallback-spec.md) | Detailed specification for SMS/USSD fallback | Draft |
| [feature-specs/multi-agency-escalation-spec.md](feature-specs/multi-agency-escalation-spec.md) | Detailed specification for Multi-Agency Escalation | Draft |
| [feature-specs/template-feature-spec.md](feature-specs/template-feature-spec.md) | Reusable template for future feature specs | Ready |
| [feature-specs/remaining-features.md](feature-specs/remaining-features.md) | List of features not yet specified | Pending |

### Features Not Yet Specified

See [feature-specs/remaining-features.md](feature-specs/remaining-features.md) for a complete list of features that need detailed specifications, including:

- Disaster Mode / NDRRMC Integration
- Responder Scheduling
- Admin Analytics Dashboard
- Evidence Chain
- Community Safety Network
- Accessibility Suite

### Prototype Specifications

| Document | Purpose |
|----------|---------|
| [prototype-prompts/responder-mobile-app-prompt.md](prototype-prompts/responder-mobile-app-prompt.md) | UI/UX specifications for responder mobile app |
| [prototype-prompts/dispatcher-dashboard-prompt.md](prototype-prompts/dispatcher-dashboard-prompt.md) | UI/UX specifications for dispatcher dashboard |

### Research Documents

| Document | Purpose |
|----------|---------|
| [emergency-services-philippines.md](research/emergency-services-philippines.md) | Research on Philippine emergency services landscape |

### Technical Documents

| Document | Purpose |
|----------|---------|
| [technical/database-schema-readiness.md](technical/database-schema-readiness.md) | Gap analysis for database schema |
| [technical/technical-architecture.md](technical/technical-architecture.md) | System architecture design |
| [technical/unified-data-dictionary.md](technical/unified-data-dictionary.md) | Consolidated entity definitions |
| [technical/api-specification.md](technical/api-specification.md) | REST API endpoints |

---

## Feature Matrix

| Feature | Brief | Spec | Prototype | Priority |
|---------|-------|------|-----------|----------|
| Public App | ✓ | - | - | MVP |
| Responder App | ✓ | - | ✓ | MVP |
| Dispatcher Dashboard | ✓ | - | ✓ | MVP |
| First Aider Network | ✓ | - | - | MVP |
| Silent SOS | ✓ | ✓ | - | MVP |
| SMS/USSD Fallback | ✓ | ✓ | - | MVP |
| Multi-Agency Escalation | ✓ | ✓ | - | MVP |

---

## Key Terminology

| Term | Definition |
|------|------------|
| **First Aider** | Registered medical professional (nurse, doctor) who receives automatic alerts for nearby emergencies matching their profession |
| **Responder** | Police, Ambulance, or Fire personnel who respond to emergencies |
| **Dispatcher/Station Monitor** | Support personnel who monitor incidents and assist when no responders self-dispatch |
| **Silent SOS** | Hidden emergency activation method for dangerous situations |
| **Multi-Agency** | Automatic dispatch of multiple agencies for complex emergencies |
| **Decentralized Response** | System where responders see emergencies directly without going through a dispatcher |

---

## Quick Start

1. **Read the Product Brief first** - [product-brief-emergency-response-platform.md](product-brief-emergency-response-platform.md)
2. **Understand the users** - [personas-detailed.md](personas-detailed.md)
3. **See user flows** - [user-journey-maps.md](user-journey-maps.md)
4. **Deep dive into features** - See feature-specs/ folder

---

## Contributing to Documentation

When adding new documents:

1. Use the [feature-specs/template-feature-spec.md](feature-specs/template-feature-spec.md) for feature specs
2. Update this index file with new documents
3. Maintain consistent terminology (see Key Terminology above)
4. Include cross-references to related documents

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-03-05 | 1.0 | Initial product brief |
| 2026-03-13 | 1.1 | Added feature specifications, updated personas |
| 2026-03-13 | 1.2 | Created document index, synced all files |

---

**Document Status:** Maintained
**Next Review:** Monthly
