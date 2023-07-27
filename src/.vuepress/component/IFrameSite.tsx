import {defineComponent} from 'vue';

export default defineComponent({
    props: {
        src: {type: String},
    },
    setup(props: { name: string; }) {
        console.log("view name", props.src);
        return () => <>
            <iframe src={props.src} scrolling="no" style="width: 100%;height: 500px;" frameborder="0"></iframe>
        </>
    }

})