<script>
    import { 
    App,
    Navbar,  
    Tabbar,
    TabbarLink, 
    Toolbar,
    Link, 
    Range,  
    List,
    ListItem,
    Button,
    Progressbar,
    Panel,
    Page,
    Block,
    BlockTitle,
    Sheet,
    } from 'konsta/svelte';

    let backgroundColor = {
        bgMaterial : "bg-[black]",
    };
</script>

<Page colors={backgroundColor} class="flex items-center justify-center">
    <Link href="/playlist/all">LIBRARY</Link>
</Page>
