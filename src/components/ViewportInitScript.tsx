const VIEWPORT_INIT = `(function(){try{var d=window.matchMedia("(min-width:768px)").matches;var v=d?"desktop":"mobile";document.documentElement.dataset.viewport=v;if(document.body)document.body.dataset.viewport=v;}catch(e){}})();`;

export function ViewportInitScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: VIEWPORT_INIT,
      }}
    />
  );
}
