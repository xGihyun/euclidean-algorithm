<script lang="ts">
import * as Form from "$lib/components/ui/form/index.js";
import { Input } from "$lib/components/ui/input/index.js";
import { Button } from "$lib/components/ui/button/index.js";
import * as Card from "$lib/components/ui/card/index.js";
import { formSchema } from "./schema";
import { superForm } from "sveltekit-superforms";
import { zod4Client } from "sveltekit-superforms/adapters";
import katex from "katex";
import "katex/dist/katex.min.css";

let { data } = $props();

// State to hold our math results
let calculationResult = $state<{
	steps: string[];
	gcd: number;
	lcm: number;
	m: number;
	n: number;
} | null>(null);

const form = superForm(data.form, {
	validators: zod4Client(formSchema),
	SPA: true,
	onUpdate({ form }) {
		if (form.valid) {
        // @ts-expect-error this works
			runEuclidean(parseInt(form.data.num1), parseInt(form.data.num2));
		}
	},
	resetForm: false,
});

const { form: formData, enhance, reset } = form;

function runEuclidean(a: number, b: number) {
	let m = Math.max(a, b);
	let n = Math.min(a, b);
	const origM = m;
	const origN = n;
	const steps: string[] = [];

	while (n !== 0) {
		let q = Math.floor(m / n);
		let r = m % n;
		// Generate step using LaTeX
		steps.push(
			katex.renderToString(`${m} = ${n}(${q}) ${r > 0 ? `+ ${r}` : ""}`),
		);
		m = n;
		n = r;
	}

	calculationResult = {
		steps,
		gcd: m,
		lcm: (origM * origN) / m,
		m: origM,
		n: origN,
	};
}

function handleClear() {
	reset(); // Resets the form errors and data
	calculationResult = null; // Clears the solution UI
}
</script>

<div class="container mx-auto max-w-2xl py-10 space-y-8">
  
  <Card.Root>
    <Card.Header>
      <Card.Title>THE EUCLIDEAN ALGORITHM</Card.Title>
    </Card.Header>
    <Card.Content class="space-y-4 text-sm leading-relaxed">
      <p>
        Let {@html katex.renderToString("m")} and {@html katex.renderToString("n")} be positive integers with 
        {@html katex.renderToString("n \\leq m")}. Let:
      </p>
      
      <div class="bg-muted p-4 rounded-md font-serif italic text-center space-y-1">
        <p>{@html katex.renderToString("m = nq_1 + r_1")}</p>
        <p>{@html katex.renderToString("n = r_1q_2 + r_2")}</p>
        <p>{@html katex.renderToString("r_1 = r_2q_3 + r_3")}</p>
        <p>{@html katex.renderToString("\\dots")}</p>
        <p>{@html katex.renderToString("r_{N-1} = r_Nq_N")}</p>
      </div>

      <p>
        be the result of iterating the Division Algorithm, where {@html katex.renderToString("r_N")} is the last non-zero remainder. 
        Then <strong>{@html katex.renderToString("\\gcd(m,n) = r_N")}</strong>.
      </p>

        <p>
          The greatest common divisor and the least common multiple are related by:
          <span class="block text-center mt-4 text-base">
            {@html katex.renderToString(
              "\\displaystyle \\text{lcm}(m,n) = \\frac{m \\cdot n}{\\gcd(m,n)}", 
              { displayMode: true }
            )}
          </span>
        </p>
    </Card.Content>
  </Card.Root>

  <Card.Root>
    <Card.Content class="pt-6">
      <form method="POST" use:enhance class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Field {form} name="num1">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>First Integer</Form.Label>
                <Input {...props} type="number" placeholder="e.g. 13" bind:value={$formData.num1} />
              {/snippet}
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="num2">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Second Integer</Form.Label>
                <Input {...props} type="number" placeholder="e.g. 8" bind:value={$formData.num2} />
              {/snippet}
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <Button type="submit" class="flex-1">Calculate</Button>
          <Button type="button" class="flex-1" variant="outline" onclick={handleClear}>Clear</Button>
        </div>
      </form>

      {#if calculationResult}
        <div class="mt-8 border-t pt-8 space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div>
            <p class="font-bold underline text-primary mb-4 tracking-tight">SOLUTION:</p>
            <div class="space-y-3 bg-slate-50 p-6 rounded-xl border border-slate-100">
              {#each calculationResult.steps as step}
                <div class="text-lg">{@html step}</div>
              {/each}
            </div>
          </div>

          <div class="space-y-2 border-l-4 border-primary pl-4 text-slate-700 text-lg">
            <p>The integers are <strong>{calculationResult.m}</strong> and <strong>{calculationResult.n}</strong></p>
            <p>The greatest common divisor of {calculationResult.m} and {calculationResult.n} is <strong>{calculationResult.gcd}</strong></p>
            <p>The least common multiple of {calculationResult.m} and {calculationResult.n} is <strong>{calculationResult.lcm}</strong></p>
          </div>
        </div>
      {/if}
    </Card.Content>
  </Card.Root>
</div>
