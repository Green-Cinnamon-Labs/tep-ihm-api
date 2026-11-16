# tep-ihm-api

Backend of the Tennessee Eastman web HMI, in Node and TypeScript. It replaces the FastAPI backend of [`tep-ihm`](https://github.com/Green-Cinnamon-Labs/tep-ihm) v1. It streams the live plant to the browser, follows the supervisor's verdict in Kubernetes, sends commands to the plant and stores capture sessions.

Its client is [`tep-ihm-web`](https://github.com/Green-Cinnamon-Labs/tep-ihm-web).

Part of the [Hefesto](https://github.com/Green-Cinnamon-Labs/spec-hefesto) research line. Work is tracked in this repository's issues and on the [GCLabs board](https://github.com/orgs/Green-Cinnamon-Labs/projects/12).
