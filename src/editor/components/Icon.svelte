<script lang="ts">
  export let name: string;
  export let preload: string[] = [];
  export let color = "currentColor";
  export let size = "1em";
  const paths = {};

  async function fetchPath(name: string): Promise<string> {
    const parser = new DOMParser();

    const response = await fetch(`/icons/${name}.svg`);
    const svgSource = await response.text();

    const svg = parser.parseFromString(svgSource, "image/svg+xml");
    const pathElement = svg.getElementsByTagName("path")[0];

    return pathElement.getAttribute("d");
  }

  function getIconPath(name: string) {
    if (!paths[name]) {
      paths[name] = fetchPath(name);
    }

    return paths[name];
  }
  
  preload.forEach(getIconPath);

  $: path = getIconPath(name);
</script>

<svg width={size} height={size} viewBox="0 0 24 24">
  {#await path then path}
    <path d={path} fill={color} />
  {/await}
</svg>

<style lang="scss">
  path {
    transition: fill var(--anim-short);
  }
</style>
