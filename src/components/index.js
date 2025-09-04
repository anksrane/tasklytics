import Input from "./ui/Input";
import Select from "./ui/Select";
import RadioCheckbox from "./ui/RadioCheckbox";
import InputFile from "./ui/InputFile";
import InputSearch from './ui/InputSearch';
import Button from "./ui/Button";
import DatePicker from "./ui/DatePicker";
import MultiSelect from "./ui/MultiSelect";
import MultiSelect_Tag from "./ui/MultiSelect_Tag";
import ButtonWithIcon from "./ui/ButtonWithIcon";
import Loader from "./ui/Loader";

import Tasks from "./tasks/Tasks";
import AddTask from "./tasks/AddTask";
import ViewTask from "./tasks/ViewTask";
import Deleted from "./tasks/Deleted";
import ConfirmTrashModal from "./tasks/ConfirmTrashModal";
import ConfirmDeleteModal from "./tasks/ConfirmDeleteModal";
import RestoreTrashModal from "./tasks/RestoreTrashModal";

import Dashboard from './dashboard/Dashboard'
import CountCard from "./dashboard/CountCard";
import StackedBarChart from "./charts/StackedBarChart";
import TasksDueThisWeek from "./dashboard/TasksDueThisWeek";
import PieChart from "./charts/PieChart";

import ClientsList from './clients/ClientsList';
import AddEditClient from './clients/AddEditClient';
import DeleteClient from './clients/DeleteClient';

import PhaseList from "./phases/PhaseList";
import AddEditPhase from './phases/AddEditPhase';
import DeletePhase from './phases/DeletePhase';

import PrioritiesList from "./priorities/PrioritiesList";
import AddEditPriorities from './priorities/AddEditPriorities';
import DeletePriorities from './priorities/DeletePriorities';

import StatusesList from './statuses/StatusesList';
import AddEditStatus from './statuses/AddEditStatus';
import DeleteStatus from "./statuses/DeleteStatus";

import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import AppLayout from "./layout/AppLayout";
import Login from "./layout/Login";

import Skeleton from "./ui/Skeleton/Skeleton";
import ChartSkeleton from "./ui/Skeleton/ChartSkeleton";
import TasksDueThisWeekSkeleton from './ui/Skeleton/TasksDueThisWeekSkeleton';
import PieChartSkeleton from './ui/Skeleton/PieChartSkeleton';

export { 
    Loader,
    Input, 
    Select, 
    RadioCheckbox,
    InputFile, 
    InputSearch,
    Button, 
    ButtonWithIcon,
    DatePicker,
    MultiSelect,
    MultiSelect_Tag,

    Login,
    Tasks,
    AddTask,
    ViewTask,
    Deleted,
    ConfirmTrashModal,
    ConfirmDeleteModal,
    RestoreTrashModal,    

    Dashboard,
    CountCard,
    StackedBarChart,
    TasksDueThisWeek,
    PieChart,

    ClientsList,
    AddEditClient,
    DeleteClient,

    PhaseList,
    AddEditPhase,
    DeletePhase,

    PrioritiesList,
    AddEditPriorities,
    DeletePriorities,

    StatusesList,
    AddEditStatus,
    DeleteStatus,

    Sidebar,
    Header,
    AppLayout,

    Skeleton,
    ChartSkeleton,
    PieChartSkeleton,
    TasksDueThisWeekSkeleton
};