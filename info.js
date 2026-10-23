import {createElement,Info,FileSearch,CalendarClock} from 'lucide';
export const infoIcon=()=>createElement(Info,{'aria-hidden':'true',width:20,height:20}).outerHTML;

export const sourceIcon=()=>createElement(FileSearch,{"aria-hidden":"true",width:20,height:20}).outerHTML;
export const deadlineIcon=()=>createElement(CalendarClock,{"aria-hidden":"true",width:16,height:16}).outerHTML;
