import React from "react";
import { useDispatch, useSelector } from "react-redux";
import langs from "../../lang";

export default function LoadMore({ result }) {
  const dispatch = useDispatch();
  const { page } = useSelector(state => state.globalState);
  const { lang } = useSelector(state => state);

  return (
    <div className="text-center">
      {result < page * 8 ? (
        ""
      ) : (
        <button className="btn btn-dark" onClick={() => dispatch({ type: "PAGE", payload: page })}>
          {langs[lang].loadMore}
        </button>
      )}
    </div>
  );
}
