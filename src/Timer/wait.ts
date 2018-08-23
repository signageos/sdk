
export default function wait(timeout: number) {
	return new Promise((resolve: () => void) => setTimeout(() => resolve(), timeout));
}
