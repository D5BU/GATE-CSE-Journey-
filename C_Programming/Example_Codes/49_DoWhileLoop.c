//Program to print numbers 1 to 10 using Do-While LOOP
#include<stdio.h>
int main (void)
{
    int i=1;
    do 
    {
        printf("%d\t", i);
        i = i+1;
    }
    while(i<=10);
    printf("\n");
    return 0;
}